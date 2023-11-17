"use client"

import { usePathname } from "next/navigation"
import { deleteThread } from "@/server/actions/thread.actions"
import { useToast } from "../ui/use-toast"
import Image from "next/image"
import { useCustomHook } from "../ui/LoaderContext"

interface props {
  id: string
}
const DeleteThread = ({ id }: props) => {
  const { hideLoader, showLoader,ThreadFeed, setThreadFeed, setIsNewThread }: any = useCustomHook()
  const { toast } = useToast()
  const path = usePathname()
  const deletePost = async () => {
    showLoader()
    const data = await deleteThread(id, path)
    hideLoader()
    toast({ title: "Deleted Succesfully" })
    if(path === '/'){
      let newData = [...ThreadFeed.Data];
      newData = newData.filter(prev => prev._id !== id)
      setThreadFeed((prevState: any) => ({ ...prevState, Data: newData }));
    }else{
      setIsNewThread(true)
    }
    if (data?.success === true) {

    }
  }
  return (
    <div className="flex gap-3 items-center" onClick={deletePost}>
      <Image src="/assets/delete.svg" alt="delete" width={24} height={24} className="object-contain cursor-pointer" />
      <p className="floating-btn">Delete</p>
    </div>

  )
}

export default DeleteThread

