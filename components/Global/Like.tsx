"use client"

import { addLike, disLike } from "@/server/actions/thread.actions"
import Image from "next/image"
import { useState } from "react"
import { useCustomHook } from "../ui/LoaderContext"
import { useToast } from "../ui/use-toast"
import { usePathname } from "next/navigation"
import Link from "next/link"


interface props{
    threadId: string,
    userId: string,
    isLiked: boolean
    likeCount: number
}
const Like = ({threadId, userId, isLiked, likeCount}: props) => {
    const [isLike, setisLike] = useState(isLiked)
    const {hideLoader, showLoader, setThreadFeed, ThreadFeed, setIsNewThread}: any = useCustomHook()
    const {toast} = useToast()
    const path = usePathname()

    const like = async () =>{
        if(isLike === false){
            showLoader()
            const data = await addLike(threadId, userId, path)
            hideLoader()
            if(data?.success){
                setisLike(true)
                if(path === '/'){
                    const newData = [...ThreadFeed.Data];
                    newData.map(item =>{
                        if(item._id === threadId){
                            item.likes.push(userId)
                        }
                    })
                    setThreadFeed((prevState: any) => ({ ...prevState, Data: newData }));
                }else{
                    setIsNewThread(true)
                }
                toast({title: "Post Liked !!"})
            }
        }
        if(isLike === true){
            showLoader()
            const data = await disLike(threadId, userId, path)
            hideLoader()
            if(data?.success){
                setisLike(false)
                if(path === '/'){
                    const newData = [...ThreadFeed.Data];
                    newData.map(item =>{
                        if(item._id === threadId){
                            item.likes =  item.likes.filter((item: string) => item !== userId)
                        }
                    })
                    setThreadFeed((prevState: any) => ({ ...prevState, Data: newData }));
                }else{
                    setIsNewThread(true)
                }
            }
        }

    }
    return (
        <div className="relative">
            <Image
                src={isLike === false ?  '/assets/heart-gray.svg' : '/assets/heart-filled.svg'}
                alt='heart'
                width={24}
                height={24}
                className='cursor-pointer object-contain'
                onClick={like}
            />
            {likeCount > 0 && <Link href={`/thread/likes/${threadId}`} className="text-gray-1 left-0 absolute -bottom-4 text-tiny-medium text-center min-w-max z-20">{likeCount === 1 ? likeCount : `you & ${likeCount-1}`} likes</Link> }
        </div>
    )
}

export default Like
