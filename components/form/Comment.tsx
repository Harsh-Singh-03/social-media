"use client"

import { addComment } from "@/server/actions/thread.actions"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react"
import { useToast } from "../ui/use-toast";
interface props{
    threadId : string;
    commentId: string;
    IsReply: boolean;
    currentUserId : string;
    currentUserImg: string;
    community: string | null
}
const Comment = ({threadId,commentId,IsReply, currentUserId, currentUserImg, community}: props) => {    
    const pathname = usePathname()
    const [comment, setComment] = useState("")
    const {toast} = useToast()
    const onchange = (e: any) =>{
        setComment(e.target.value)
    }
    const handleSubmit = async(e: any) =>{
        e.preventDefault()
        if(comment){
           const data = await addComment(threadId,commentId, comment,currentUserId, pathname,community)
           setComment("")
           toast({
            title: IsReply === true ? "Reply Added !!" : "Comment Added !!"
           })
        }
    }
    
    return (
        <form className="w-full flex gap-2 lg:gap-4 py-4 lg:py-6 flex-row items-center border-t border-t-dark-2 border-b border-b-dark-2 max-w-none" onSubmit={handleSubmit}>
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full relative object-cover">
            <Image className="rounded-full object-cover shadow-md" src={currentUserImg} alt="profile" fill />

            </div>
            <div className="form-group my-0 flex-1">
                <input type="text" className='input my-0 w-full bg-transparent outline-none' value={comment} onChange={onchange} placeholder={IsReply === true ? "Reply..." : "Comment..."} required />
            </div>
            <div className="form-group">
                <button type="submit" id="submit-btn" className="btn px-4 my-0 lg:px-8">{IsReply === true ? "Reply" : "Comment"}</button>
            </div>
        </form>
    )
}

export default Comment
