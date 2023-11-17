import { pusherServer } from "@/lib/pusher"
import Message from "@/server/models/message.model"
import User from "@/server/models/user.model"
import { connectToDB } from "@/server/mongoose"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        await connectToDB()
        const payload = await request.json()
        const skipAmount = (payload.pageNumber - 1) * payload.pageSize

        if(!payload.searchString || payload.searchString === ''){
            await Message.updateMany({ receiver: payload.user1Id, sender: payload.user2Id, messageStatus: { $ne: "seen" } }, { $set: { messageStatus: "seen" } })
    
            const currentUser = await User.findById(payload.user1Id)
            const receiverData = await User.findById(payload.user2Id)
    
            if(currentUser && currentUser.chatUsers && currentUser.chatUsers.length > 0){
                const isExist2 = currentUser.chatUsers.find((user: any) => user._id.toString() === payload.user2Id.toString())
                if (isExist2 && isExist2.messageAuthor !== 'Sender' && isExist2.messageStatus === 'sent') {
                    Object.assign(isExist2, {
                        messageStatus: 'seen',
                    })
                    await User.findByIdAndUpdate(payload.user1Id , {chatUsers: currentUser.chatUsers})
                }
            }
    
            if(receiverData && receiverData.chatUsers && receiverData.chatUsers.length > 0){
                const isExist = receiverData.chatUsers.find((user: any) => user._id.toString() === payload.user1Id.toString())
                if (isExist && isExist.messageAuthor === 'Sender' && isExist.messageStatus === 'sent') {
                    Object.assign(isExist, {
                        messageStatus: 'seen',
                    })
                    await User.findByIdAndUpdate(payload.user2Id , {chatUsers: receiverData.chatUsers})
                    await pusherServer.trigger(
                        `inboxes`,
                        "inboxes",
                        {
                         success: true,
                         sender: payload.user1Id ,
                         receiver: payload.user2Id 
                        }
                    )
                }
            }
            const sortedUserIDs = [payload.user1Id, payload.user2Id].sort();
    
            await pusherServer.trigger(
                `chat${sortedUserIDs[0]}${sortedUserIDs[1]}`,
                "seen-all",
                {
                 success: true,
                 user: payload.user2Id
                }
            )
        }

        const messages = await Message.find({
            $and: [
                {
                    $or: [
                        { sender: payload.user1Id, receiver: payload.user2Id },
                        { sender: payload.user2Id, receiver: payload.user1Id }
                    ]
                },
                {
                    $or: [
                        { content: { $regex: payload.searchString, $options: 'i' } }
                    ]
                }
            ]
        }).skip(skipAmount).limit(payload.pageSize).sort({ timestamp: -1});
        
        if(!messages || messages.length === 0){
            return NextResponse.json({success: false, messages: [], isNext: false, totalDocumentCount: 0})
        }

        const totalDocumentCount = await Message.countDocuments({  $and: [
            {
                $or: [
                    { sender: payload.user1Id, receiver: payload.user2Id },
                    { sender: payload.user2Id, receiver: payload.user1Id }
                ]
            },
            {
                $or: [
                    { content: { $regex: payload.searchString, $options: 'i' } }
                ]
            }
        ]})
        const isNext = totalDocumentCount > skipAmount + messages.length;
        return NextResponse.json({success: true, messages: messages || [], isNext, totalDocumentCount})
    
      } catch (error: any) {
        console.log(error)
        NextResponse.json({success: false})
      }

}