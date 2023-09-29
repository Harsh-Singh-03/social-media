"use client"

import { postThread } from "@/server/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

interface Props {
    userId: string;
}
const CreateThread = ({userId}: Props) => {    
    const pathName = usePathname()
    const router = useRouter()
    const [threadData, setThreadData] = useState("")
    const { toast } = useToast()
    const onchange = (e:any) =>{
        setThreadData(e.target.value)
    }
    const handleSubmit = async (e: any) =>{
        e.preventDefault()
        if(threadData.length >= 12 ){
         await postThread({text: threadData, author: userId, path: pathName, communityId: null })
         toast({title: "Thread Created Successfully!"})
         router.push("/")
        }else{
            alert("post should be 12 charcter long!!")
        }
    }
    return (
        <form className="form-container w-full" onSubmit={handleSubmit}>
            <div className="form-group my-4">
                <label className="label">Content : </label>
                <textarea className="input h-auto py-2" value={threadData} name="bio" rows={8} onChange={onchange} required minLength={12} />
            </div>
            <div className="form-group">
                <button type="submit" className="btn">Create Thread</button>
            </div>
        </form>
    )
}

export default CreateThread
