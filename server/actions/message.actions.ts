"use server"
import Message from "../models/message.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { pusherServer } from "@/lib/pusher"

export const updateVisibility = async (msgId: string, from: string, to: string) => {
    try {
        connectToDB()
        const message = await Message.findByIdAndUpdate(msgId, { messageStatus: "seen" })
        const sortedUserIDs = [from, to].sort();
        await pusherServer.trigger(
            `chat${sortedUserIDs[0]}${sortedUserIDs[1]}`,
            "incoming-message",
            {
                success: true,
                message,
                isView: true
            }
        )
        const currentUser = await User.findById(from)
        const receiverData = await User.findById(to)

        if(currentUser && currentUser.chatUsers && currentUser.chatUsers.length > 0){
            const isExist2 = currentUser.chatUsers.find((user: any) => user._id.toString() === to.toString())
            if (isExist2 && isExist2.messageAuthor !== 'Sender') {
                Object.assign(isExist2, {
                    messageStatus: 'seen',
                })
                await User.findByIdAndUpdate(from , {chatUsers: currentUser.chatUsers})
            }
        }

        if(receiverData && receiverData.chatUsers && receiverData.chatUsers.length > 0){
            const isExist = receiverData.chatUsers.find((user: any) => user._id.toString() === from.toString())
            if (isExist && isExist.messageAuthor === 'Sender') {
                Object.assign(isExist, {
                    messageStatus: 'seen',
                })
                await User.findByIdAndUpdate(to , {chatUsers: receiverData.chatUsers})
            }
        }
        await pusherServer.trigger(
            `inboxes`,
            "inboxes",
            {
             success: true
            }
        )
        return { success: true }
    } catch (error: any) {
        console.log(error.message)
    }
}

export const sendMessage = async (from: string, to: string, text: string, type:string) => {
    try {
        connectToDB()
        if (!from || !to || !text ) return { success: false, message: "Something went wrong !" }
        var sortedUserIDs = [from, to].sort();
        const message = new Message({
            sender: from,
            receiver: to,
            content: text,
            contentType: type
        })
        await message.save()
        const SenderData = await User.findById(from)
        const ReceiverData = await User.findById(to)
        // This is for in overall site we get notification of message
        await pusherServer.trigger(
            `chatnotification${to}`,
            "chat-notification",
            {
                success: true,
                name: ReceiverData.name,
                receiver: to,
                sender: from
            }
        )
        const isExist = SenderData.chatUsers.find((user: any) => user._id.toString() === to.toString())
        if (isExist) {
            Object.assign(isExist, {
                lastMessage: text,
                messageType: type,
                messageStatus: 'sent',
                messageAuthor: "Sender",
                timeStamp: Date.now()
            })
        } else {
            SenderData.chatUsers.push({
                _id: ReceiverData._id,
                id: ReceiverData.id,
                username: ReceiverData.username,
                name: ReceiverData.name,
                image: ReceiverData.image,
                lastMessage: text,
                messageType: type,
                messageStatus: 'sent',
                messageAuthor: "Sender",
                timeStamp: Date.now()
            })

        }

        const isExist1 = ReceiverData.chatUsers.find((user: any) => user._id.toString() === from.toString())
        if (isExist1) {
            Object.assign(isExist1, {
                lastMessage: text,
                messageType: type,
                messageStatus: 'sent',
                messageAuthor: "Recevier",
                timeStamp: Date.now()
            })
        } else {
            ReceiverData.chatUsers.push({
                _id: SenderData._id,
                id: SenderData.id,
                username: SenderData.username,
                name: SenderData.name,
                image: SenderData.image,
                lastMessage: text,
                messageType: type,
                messageStatus: 'sent',
                messageAuthor: "Recevier",
                timeStamp: Date.now()
            })
            
        }
        // Triggerer for sendding message realtime with status seen and sent also
        await pusherServer.trigger(
            `chat${sortedUserIDs[0]}${sortedUserIDs[1]}`,
            "incoming-message",
            {
                success: true,
                message,
                isView: false
            }
            )
            await User.findByIdAndUpdate(from, {chatUsers: SenderData.chatUsers })
            await User.findByIdAndUpdate(to, {chatUsers: ReceiverData.chatUsers })
            
            // Have to list in contact for sidebar whenever message send then from both end we have to update their last messgage 
        await pusherServer.trigger(
            `inboxes`,
            "inboxes",
            {
             success: true
            }
        )
        
        return { success: true, message: "Message added" }
    } catch (error: any) {
        console.log(error.message)
    }
}

export const updateChatList = async (paramsId: string) => {
    try {
        connectToDB()
        const Child = await User.findById(paramsId);

        if (!Child) {
            return { success: false, message: "User not found" };
        }
        return { success: true, Data: Child };
        // Have to get the messagess
    } catch (error: any) {
        console.log(error.message)
    }
}
