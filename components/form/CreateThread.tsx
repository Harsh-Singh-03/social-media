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
import Image from "next/image";
import { useUploadThing } from "@/server/uploadthing";

interface Props {
    userId: string;
    data?: any
}
const CreateThread = ({ userId, data }: Props) => {
    const pathName = usePathname()
    const router = useRouter()
    const [threadData, setThreadData] = useState("")
    const [position, setPosition] = useState("Personal")
    const [Files, setFiles] = useState([])
    const { startUpload } = useUploadThing("media")
    const [Img, setImg] = useState('/assets/upload.svg')
    const [labelDisplay, setLabelDispay] = useState('hidden')
    const { toast } = useToast()
    const { showLoader, hideLoader }: any = useLoader();


    const onchange = (e: any) => {
        setThreadData(e.target.value)
    }
    const toggleFile = (e: any) =>{
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            var filesize = ((file.size / 1024) / 1024).toFixed(4)
            if (parseFloat(filesize) < 2) {
                setFiles(Array.from(e.target.files))
                const reader: any = new FileReader();
                reader.onload = () => {
                    setImg(reader.result)
                    setLabelDispay('block')
                };
                reader.readAsDataURL(file);

            } else {
                e.target.value = ""
                toast({ title: "Image is too big only supports below 2mb" })
            }

        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (threadData.length >= 12) {
            showLoader()
            var fileEl = '';
                    
            if (Files && Files.length > 0) {
                const data = await startUpload(Files)
                console.log(data)
                if (data && data[0].fileUrl) {
                    fileEl = data[0].fileUrl
                    setFiles([])
                }
            }
            await postThread({ text: threadData, image: fileEl ? fileEl : '' , author: userId, path: pathName, communityId: position === "Personal" ? null : position.split("|")[0] })
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
            <div className="flex gap-4 px-4 relative items-center justify-center bg-dark-4 py-3 rounded-lg">
                <label className={`${labelDisplay} relative w-14 rounded-lg h-10 overflow-hidden`}>
                    <Image src={Img} id="profile-avatar" alt="/assets/upload.svg" fill className={`w-full h-full object-cover`} />
                </label>
                <div className="flex gap-3 items-center z-0 pointer-events-none">
                  <Image src="/assets/upload.svg" alt="" width={20} height={20} className={`object-contain ${labelDisplay === "block" ? "hidden" : "block"}`} />
                  <span className="text-gray-1 text-small-regular">{labelDisplay === "block" ? "Upload Another" : "Upload File"}</span>
                </div>
                <input type="file" className="w-full h-full absolute top-0 left-0 opacity-0 z-30 cursor-pointer" onChange={toggleFile} accept='image/*' />
            </div>
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
