"use client"

import { removeMember, requestForJoin } from "@/server/actions/community.actions";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";


interface props {
    btnText: string;
    communityId: string;
    userId: string

}
const CommunityFunc = ({btnText, communityId, userId}: props) => {
    const path = usePathname()
    const {toast} = useToast()
    const JoinCommunity = async() =>{
        const data = await requestForJoin(communityId, userId, path)
        if(data?.success){
            toast({title: data?.message})
        }
    }
    const leaveCommunity = async() =>{
        const data = await removeMember(userId, userId, communityId, "Leave", path)
        if(data?.success){
            toast({title: data?.message})
        }
    }
  return (
    <div className="flex gap-4 w-full">
     {btnText === "Delete" && <button className="btn flex-1 mt-0 bg-red-500 hover:bg-red-600">{btnText}</button>}
     {btnText === "Leave" && <button className="btn flex-1 mt-0 bg-red-500 hover:bg-red-600" onClick={leaveCommunity}>{btnText}</button>}
     {btnText === "Join" && <button className="btn flex-1 mt-0" onClick={JoinCommunity}>{btnText}</button>}
      
    </div>
  )
}

export default CommunityFunc
