"use client"

import { postThread } from "@/server/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLoader } from "../ui/LoaderContext";

interface Props {
    userId: string;
    data?: any
}
const CreateThread = ({ userId, data }: Props) => {
    const pathName = usePathname()
    const router = useRouter()
    const [threadData, setThreadData] = useState("")
    const [position, setPosition] = useState("Personal")
    const { toast } = useToast()
    const { showLoader, hideLoader }: any = useLoader();

    const onchange = (e: any) => {
        setThreadData(e.target.value)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (threadData.length >= 12) {
            showLoader()
            await postThread({ text: threadData, author: userId, path: pathName, communityId: position === "Personal" ? null : position.split("|")[0] })
            hideLoader()
            toast({ title: "Thread Created Successfully!" })
            router.push("/")
        } else {
            alert("post should be 12 charcter long!!")
        }
    }
    return (
        <form className="form-container w-full" onSubmit={handleSubmit}>
            {data && (
                <>
                    <label className="label">Choose Space : </label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="btn px-4 bg-dark-4 mt-0 border border-dark-4 text-gray-1 hover:bg-dark-4">{position === "Personal" ? position : position.split("|")[1]}</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-dark-4 mt-2 text-gray-1 border-none">
                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                <DropdownMenuRadioItem value="Personal" className="focus:bg-transparent focus:text-light-2 cursor-pointer">Personal</DropdownMenuRadioItem>
                                {data.map((item: any, index: number) => {
                                    return (
                                        <DropdownMenuRadioItem key={index} value={`${item.id}|${item.name}`} className="focus:bg-transparent focus:text-light-2 cursor-pointer">{item.name}</DropdownMenuRadioItem>
                                    )
                                })}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
            <div className="form-group mb-4">
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
