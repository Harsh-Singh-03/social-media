"use client"

import { deleteCommunity, removeMember, requestForJoin } from "@/server/actions/community.actions";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useLoader } from "../ui/LoaderContext";


interface props {
    btnText: string;
    communityId: string;
    userId: string

}
const CommunityFunc = ({btnText, communityId, userId}: props) => {
    const path = usePathname()
    const {toast} = useToast()
    const {hideLoader, showLoader}: any = useLoader()
    const router = useRouter()

    const JoinCommunity = async() =>{
        showLoader()
        const data = await requestForJoin(communityId, userId, path)
        hideLoader()
        if(data?.success){
            toast({title: data?.message})
        }
    }
    const leaveCommunity = async() =>{
        showLoader()
        const data = await removeMember(userId, userId, communityId, "Leave", path)
        hideLoader()
        if(data?.success){
            toast({title: data?.message})
        }
    }
    const deleteCom = async() =>{
       showLoader()
       const data = await deleteCommunity({adminId: userId, communityId})
       hideLoader()
       router.back()
       if(data?.success){
        toast({title: data.message})
       }
    }
  return (
    <div className="flex gap-4 w-full">
     {btnText === "Delete" && <button className="btn flex-1 mt-0 bg-red-500 hover:bg-red-600" onClick={deleteCom}>{btnText}</button>}
     {btnText === "Leave" && <button className="btn flex-1 mt-0 bg-red-500 hover:bg-red-600" onClick={leaveCommunity}>{btnText}</button>}
     {btnText === "Join" && <button className="btn flex-1 mt-0" onClick={JoinCommunity}>{btnText}</button>}
      
    </div>
  )
}

export default CommunityFunc
