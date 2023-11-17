"use client"
import { pusherClient } from "@/lib/pusher";
import { updateVisibility } from "@/server/actions/message.actions";
import { useEffect, useRef, useState } from "react";
import { useInView } from 'react-intersection-observer';
import Load from "../Infitine-Scroll/Load";
import Image from "next/image";
import { useChatHook } from "@/Context/ChatContext";
import { usePathname } from "next/navigation";
import AudioPlayer from "./AudioPlayer";

interface props {
    currentUserId: string;
    chatUser: string;
    image: string
}
const ChatInbox = ({ currentUserId, chatUser, image }: props) => {
    const { Message, setMessage, setLoading, loading, page, setPage, isNext, setIsNext,searchString, setSearchString }: any = useChatHook()
    const path = usePathname()
    const sendRef: any = useRef(null)
    const recieveRef: any = useRef(null)
    const { ref, inView } = useInView();

    const getAllMessages = async () => {
        setLoading(true)
        const response = await fetch(`/api/chat/get-chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pageNumber: page, pageSize: 20, user1Id: currentUserId, user2Id: chatUser, searchString: searchString })
        })
        const data = await response.json()

        if (data.success === true) {
            setLoading(false)
            setMessage(Message.concat(data.messages))
            setPage(page + 1)
            setIsNext(data.isNext)
        }
    }

    useEffect(() => {
        setPage(1)
        setSearchString('')
        setIsNext(false)
        setMessage([])
    }, [path])

    useEffect(() => {
        if (Message.length === 0) {
            getAllMessages()
        }
    }, [Message])

    useEffect(() => {
        if (inView === true && isNext === true && Message.length > 0) {
            getAllMessages()
        }
    }, [inView])


    useEffect(() => {
        // setMessage(Inbox.messages || [])
        var sortedUserIDs = [currentUserId, chatUser].sort();
        pusherClient.subscribe(`chat${sortedUserIDs[0]}${sortedUserIDs[1]}`)

        const incomingMessage = async (data: any) => {
            if (data.success === true) {

                if (data.isView === false && currentUserId === data.message.sender) {
                    setMessage((prevArray: any) =>
                        prevArray.map((obj: any) => {
                            if (obj._id === 'new-message') {
                                return { ...data.message };
                            }
                            return obj;
                        })
                    );
                    sendRef.current.play()
                }
                if (currentUserId === data.message.receiver && data.isView === false) { // This is to check receiver
                    setMessage((prev: any) => [data.message, ...prev])
                    recieveRef.current.play()
                    await updateVisibility(data.message._id, currentUserId, chatUser)
                }
                if (data.isView === true && data.message.sender === currentUserId) {
                    setMessage((prevArray: any) =>
                        prevArray.map((obj: any) => {
                            if (obj._id === data.message._id) {
                                return { ...obj, messageStatus: "seen" };
                            }
                            return obj;
                        })
                    );
                }

            }
        }
        const seenAll = (data: any) => {
            if (data.success === true && data.user === currentUserId) {
                setMessage((prevArray: any) =>
                    prevArray.map((obj: any) => {
                        if (obj.messageStatus !== 'seen') {
                            return { ...obj, messageStatus: "seen" };
                        }
                        return obj;
                    })
                );
            }
        }

        pusherClient.bind("incoming-message", incomingMessage)
        pusherClient.bind("seen-all", seenAll)

        return () => {
            pusherClient.unsubscribe(`chat${sortedUserIDs[0]}${sortedUserIDs[1]}`)
            pusherClient.unbind("incoming-message", incomingMessage)
            pusherClient.unbind("seen-all", seenAll)
        }

    }, [])


    return (
        <div className="flex-1 flex flex-col-reverse gap-2 max-h-full overflow-y-scroll custom-scrollbar px-4">
            {Message.map((msg: any, index: number) => {
                const isCurrentUser = msg.sender === chatUser
                const hasNextMessageFromSameUser = Message[index - 1]?.sender === Message[index]?.sender

                return (
                    <div className="flex gap-2 items-end" key={index}>
                        {isCurrentUser === true && hasNextMessageFromSameUser === false && (
                            <div className=" cursor-pointer">
                                <Image src={image} alt="profile" width={24} height={24} className="rounded-full object-cover" />
                            </div>
                        )}
                        <div key={index} className={`flex w-full ${msg.sender.toString() === currentUserId.toString() ? 'justify-end' : 'justify-start'} ${isCurrentUser === true && hasNextMessageFromSameUser === true ? 'ml-8' : ""}`} >

                            <div className={`rounded-xl flex items-end gap-2 w-max max-w-[80%] h-auto lg:max-w-[60%] overflow-hidden p-2 ${msg.sender.toString() === currentUserId.toString() ? `bg-dark-2 p-2 ${msg.contentType === 'Text' && 'pl-4'}` : `border-2 border-dark-2 p-2 ${msg.contentType === 'Text' && 'py-2 px-4'} `}`}>
                                {/* Will work on span considering messageType... */}
                                {msg.contentType === 'Text' && (
                                    <span className="text-light-1 text-small-regular flex-1">{msg.content}</span>
                                )}
                                {msg.contentType === 'Image' && (
                                    // <span className="text-light-1 text-small-regular flex-1">{msg.content}</span>
                                    <div className="w-full h-auto max-w-[240px] relative">
                                        <Image src={msg.content} alt="file" width={200} height={200} className={`w-full h-full object-contain rounded-xl ${msg.messageStatus === 'initial' && 'blur-sm opacity-60'}`} />
                                        {msg.messageStatus === 'initial' && (
                                            <div className="absolute w-full h-full left-0 top-0 grid place-items-center">
                                                <Load />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {msg.contentType === 'Audio' && (
                                    <AudioPlayer audioUrl={msg.content}/>
                                )}

                                {msg.sender.toString() === currentUserId.toString() && (
                                    <>
                                        {msg.messageStatus !== 'initial' ?
                                            <span className={`${msg.messageStatus === "seen" ? 'text-primary-500' : 'text-gray-1'} min-w-max text-tiny-medium`}>{msg.messageStatus}</span>
                                            : <span className="w-4 h-4 rounded-full border-2 border-dotted border-gray-1"></span>
                                        }

                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                )
            })}
            <div id="last-div" ref={ref} className="text-light-1 opacity-0 h-1">hi</div>
            {loading && <Load />}
            <audio ref={sendRef} className="hidden">
                <source src='/sounds/send.mp3' type="audio/mp3" />
            </audio>
            <audio ref={recieveRef} className="hidden">
                <source src='/sounds/receive.wav' type="audio/wav" />
            </audio>
        </div>
    )
}

export default ChatInbox
