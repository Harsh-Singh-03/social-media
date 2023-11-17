"use client"
import Image from "next/image";
import ChatHead from "./ChatHead"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useChatHook } from "@/Context/ChatContext";
import { pusherClient } from "@/lib/pusher";
import Load from "../Infitine-Scroll/Load";
interface props {
    username: any;
    paramsId?: any;
    avatar: string;
    userId: string;
    userDbId: string
}


const ChatSideBar = ({ username, paramsId, avatar, userId, userDbId }: props) => {

    // const [inboxs , setInboxes] = useState([])
    const { inboxs, setInboxes }: any = useChatHook()
    const [Loader, setLoader] = useState(inboxs.length === 0 ? true : false)
    const getContacts = async () => {
        try {
            const response = await fetch(`/api/chat/get-chat-list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId })
            })
            const data = await response.json()
            if (data && data.success === true) {
                setLoader(false)
                setInboxes(data.chatList || [])
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        if (inboxs.length === 0) {
            getContacts()
        }
    }, [])

    useEffect(() => {

        pusherClient.subscribe(`inboxes`)

        const notify = (data: any) => {
            if (data.success === true) {
                getContacts()
            }
        }

        pusherClient.bind("inboxes", notify)

        return () => {
            pusherClient.unsubscribe(`inboxes`)
            pusherClient.unbind("inboxes", notify)
        }
    }, [])


    return (
        <div className={`w-full lg:w-1/2 lg:max-w-md min-h-screen  max-h-screen overflow-hidden bg-dark-2 border-r border-r-dark-4 ${paramsId ? "hidden lg:block" : "block"}`}>
            <ChatHead username={username} avatar={avatar} userId={userId} userDbId={userDbId} />
            {Loader === false ? (
                <div className="max-h-full overflow-y-scroll custom-scrollbar">
                    {inboxs && inboxs.length > 0 ? inboxs.map((user: any, index: number) => {
                        const now = new Date();
                        const anotherDate = new Date(user.timeStamp);
                        let msgTime = ''
                        if (anotherDate) {
                            if (anotherDate.toDateString() === now.toDateString()) {
                                // Today, display only the time (HH:mm)
                                msgTime = anotherDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            } else {
                                const yesterday = new Date(now);
                                yesterday.setDate(now.getDate() - 1);

                                if (anotherDate.toDateString() === yesterday.toDateString()) {
                                    // Yesterday, display "Yesterday"
                                    msgTime = 'yesterday';
                                } else {
                                    // Other days, display the date (dd/mm/yyyy)
                                    msgTime = anotherDate.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
                                }
                            }
                        }
                        return (
                            <Link href={`/chat/${user._id}`} className={`flex p-4 border-b border-b-dark-4 gap-4 hover:bg-dark-3 cursor-pointer ${paramsId && paramsId === user._id.toString() ? 'bg-dark-3' : "bg-transparent"}`} key={index}>
                                <div className="profile-img-box w-14 h-14">
                                    <Image src={user.image} alt="logo" className="rounded-full object-cover shadow-md" fill />
                                </div>
                                <div className="mt-1 flex-1">
                                    <div className="flex justify-between w-full items-center relative" >
                                        <h2 className='text-light-1 text-base-regular mb-1 tracking-normal'>
                                            {user.name}
                                        </h2>

                                        <div className="grid place-items-center gap-1">
                                            {user.messageAuthor !== 'Sender' && user.messageStatus === 'sent' && (
                                                <div className="w-2 h-2 rounded-full bg-primary-500 absolute -bottom-2.5" ></div>
                                            )}
                                            <div className="text-tiny-medium text-gray-1">{msgTime}</div>
                                        </div>

                                    </div>
                                    <div className="flex gap-2 items-end">
                                        {user.messageType === 'Text' && (
                                            <span className={`${user.messageAuthor !== 'Sender' && user.messageStatus === 'sent' ? 'text-light-2' : 'text-gray-1'} text-small-medium`}>{user.lastMessage.slice(0, 30)} {user.lastMessage.length > 30 ? '..' : ''}</span>
                                        )}
                                        {user.messageType === 'Image' && (
                                            <span className={`${user.messageAuthor !== 'Sender' && user.messageStatus === 'sent' ? 'text-light-2' : 'text-gray-1'} text-small-medium`}>Shared an image.</span>
                                        )}
                                        {user.messageType === 'Audio' && (
                                            <span className={`${user.messageAuthor !== 'Sender' && user.messageStatus === 'sent' ? 'text-light-2' : 'text-gray-1'} text-small-medium`}>Shared an audio message</span>
                                        )}
                                        {user.messageAuthor === 'Sender' && (
                                            <span className={`${user.messageStatus === 'sent' ? 'text-gray-1' : 'text-primary-500'} text-tiny-medium`}>{user.messageStatus}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    }) : <p className="text-small-regular text-center text-gray-1 mt-4">No User Found</p>}

                </div>

            ) : <Load />}
        </div>
    )
}

export default ChatSideBar
