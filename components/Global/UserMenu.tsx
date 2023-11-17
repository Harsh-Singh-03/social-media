'use client'
import Image from "next/image"
import Link from "next/link"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateCommunity from "../form/CreateCommunity"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { pusherClient } from "@/lib/pusher"
import { useToast } from "../ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"

interface props {
    avatar: string;
    url: string;
    userId: string
    isChat?: boolean;
    chatUsers?: boolean;
}
function UserMenu({ avatar, url, userId, isChat, chatUsers }: props) {
    const path = usePathname()
    const { toast } = useToast()
    const [isUnseenChat , setIsUnseenChat] = useState(chatUsers || false)
    const notificationRef: any = useRef(null)
    
    useEffect(() => {

        pusherClient.subscribe(`chatnotification${userId}`)
        const notify = (data: any) => {
            if (data.success === true && data.receiver === userId && path !== `/chat/${data.sender}`) {
                toast({
                    title: `${data.name} sent you a new message`,
                    action: (
                        <ToastAction className="text-small-regular" altText="GOTO" onClick={() => {
                            window.location.href = `/chat/${data.sender}`;
                        }}
                        >GOTO</ToastAction>
                    )
                })
                setIsUnseenChat(true)
                notificationRef.current.play()
            }
        }
        pusherClient.bind("chat-notification", notify)

        return () => {
            pusherClient.unsubscribe(`chatnotification${userId}`)
            pusherClient.unbind("chat-notification", notify)
        }

    }, [])

    return (
        <div className={`${isChat === true ? '' : "fixed top-3 right-4 md:right-8"} z-40 flex gap-4 items-center`}>
            <Popover>
                <PopoverTrigger className={`relative object-cover ${isChat === true ? 'w-12 h-12' : 'w-8 h-8'} rounded-full`}>
                    <Image className="cursor-pointer object-cover rounded-full" fill src={avatar} alt="logo" />
                </PopoverTrigger>
                <PopoverContent className="bg-dark-2 max-w-max px-6 border-none mr-2 lg:mr-0">
                    <div className="grid gap-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <p className="text-light-1 pb-2 text-small-regular border-b border-b-primary-500 cursor-pointer"><span className="mr-1 text-heading4-medium text-primary-500">+</span> Create Community</p>
                            </DialogTrigger>
                            <DialogContent className="bg-dark-2 text-light-1 w-[92%] border-none rounded-md p-0">
                                <CreateCommunity userId={userId} />
                            </DialogContent>
                        </Dialog>
                        <Link href={`/profile/${url}`} className="cursor-pointer">
                            <p className="text-center text-gray-1 text-small-regular">Go To Profile</p>
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
            {isChat !== true && (
                <Link href='/chat' className={`cursor-pointer ${isUnseenChat === true ? 'chat-dot' : ""} relative`}>
                    <Image src='/assets/chat.svg' alt="chat" width={24} height={24} className="object-contain cursor-pointer" />
                </Link>
            )}
            <audio ref={notificationRef} className="hidden">
                <source src='/sounds/notification.wav' type="audio/wav" />
            </audio>
        </div>

    )
}
export default UserMenu