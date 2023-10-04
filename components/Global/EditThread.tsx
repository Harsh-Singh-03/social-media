"use client"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { editThread } from "@/server/actions/thread.actions"
import { usePathname } from "next/navigation"

import { useState } from "react"
import { useToast } from "../ui/use-toast"
import { DialogClose } from "@radix-ui/react-dialog"
import Image from "next/image"
import { useLoader } from "../ui/LoaderContext"

interface props {
    id: string,
    text: string
}
const EditThread = ({ id, text }: props) => {
    const [textInput, setTextInput] = useState(text)
    const path = usePathname()
    const { toast } = useToast()
    const { showLoader, hideLoader }: any = useLoader();
    const onchange = (e: any) => {
        setTextInput(e.target.value)
    }
    const update = async (e: any) => {
        e.preventDefault()
        if (text !== textInput) {
            showLoader()
            const Data = await editThread(id, textInput, path)
            hideLoader()
            toast({
                title: "Thread Updated !!"
            })

        }
    }
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="flex gap-3 items-center">
                        <Image src="/assets/edit.svg" alt="edit" width={24} height={24} className="object-contain cursor-pointer" />
                        <p className="floating-btn">Edit</p>
                    </div>
                </DialogTrigger>
                <DialogContent className="bg-dark-2 text-light-1 w-[92%] border-none rounded-md">
                    <form onSubmit={update} className="mt-4">
                        <textarea className="input h-auto py-2 w-full" value={textInput} name="bio" rows={4} onChange={onchange} required minLength={12} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <button className="btn w-full" type="submit">Update</button>

                            </DialogClose>

                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default EditThread
