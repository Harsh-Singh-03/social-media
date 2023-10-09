"use client"

import { addLike, disLike } from "@/server/actions/thread.actions"
import Image from "next/image"
import { useState } from "react"
import { useLoader } from "../ui/LoaderContext"
import { useToast } from "../ui/use-toast"
import { usePathname } from "next/navigation"


interface props{
    threadId: string,
    userId: string,
    isLiked: boolean
    likeCount: number
}
const Like = ({threadId, userId, isLiked, likeCount}: props) => {
    const [isLike, setisLike] = useState(isLiked)
    const {hideLoader, showLoader}: any = useLoader()
    const {toast} = useToast()
    const path = usePathname()

    const like = async () =>{
        if(isLike === false){
            showLoader()
            const data = await addLike(threadId, userId, path)
            hideLoader()
            if(data?.success){
                setisLike(true)
                toast({title: "Post Liked !!"})
            }
        }
        if(isLike === true){
            showLoader()
            const data = await disLike(threadId, userId, path)
            hideLoader()
            if(data?.success){
                setisLike(false)
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
            {likeCount > 0 && <span className="text-gray-1 absolute text-tiny-medium text-center min-w-max">{likeCount === 1 ? likeCount : `you & ${likeCount-1}`} likes</span> }
        </div>
    )
}

export default Like
