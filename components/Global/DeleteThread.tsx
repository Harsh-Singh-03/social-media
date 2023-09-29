"use client"

import { usePathname } from "next/navigation"
import { deleteThread } from "@/server/actions/thread.actions"
import { useToast } from "../ui/use-toast"
import Image from "next/image"

interface props {
  id: string
}
const DeleteThread = ({ id }: props) => {
  const { toast } = useToast()
  const path = usePathname()
  const deletePost = async () => {
    const data = await deleteThread(id, path)
    toast({ title: "Deleted Succesfully" })
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
