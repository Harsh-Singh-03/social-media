'use client'
import { editCommunityByAdmin } from "@/server/actions/community.actions"
import { useUploadThing } from "@/server/uploadthing"
import Image from "next/image"
import { useState } from "react"
import { useToast } from "../ui/use-toast"
import { usePathname, useRouter } from "next/navigation"
import { useCustomHook } from "../ui/LoaderContext"


interface props {
    adminId: string;
    name: string;
    username: string;
    bio: string;
    image: string;
}
const EditCommunity = ({ adminId, name,username, bio,image }: props) => {
    const [communityData, setCommunityData] = useState({ name: name, bio: bio, username:username })
    const [Files, setFiles] = useState([])
    const { showLoader, hideLoader }: any = useCustomHook();
    const [Img, setImg] = useState(image)
    const { startUpload } = useUploadThing("media")
    const { toast } = useToast()
    const path = usePathname()
    const router = useRouter()
    const onchange = (e: any) => {
        setCommunityData({ ...communityData, [e.target.name]: e.target.value })
    }
    const toggleFile = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            var filesize = ((file.size / 1024) / 1024).toFixed(4)
            if (parseFloat(filesize) < 2) {
                setFiles(Array.from(e.target.files))
                const reader: any = new FileReader();
                reader.onload = () => {
                    setImg(reader.result)
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
        try {
            if (communityData.name && communityData.name.length >= 3 && communityData.username && communityData.username.length >= 8) {
                if(communityData.name.includes("|")){
                    toast({title: "Name can not contain '|' ,"})
                }else{
                    showLoader()
                    var fileEl = image;
                    
                    if (Files && Files.length > 0) {
                        const data = await startUpload(Files)
                        if (data && data[0].fileUrl) {
                            fileEl = data[0].fileUrl
                        }
                    }
                    const data = await editCommunityByAdmin({
                        adminId: adminId,
                        name: communityData.name,
                        username: communityData.username,
                        bio: communityData.bio || "",
                        image: fileEl,
                        isUsernameChange: username === communityData.username ? false : true,
                        path
                    });
                    hideLoader()
                    if (data?.success) {
                        setCommunityData({ name: "", username: "", bio: "" })
                        setImg(fileEl)
                        toast({ title: data.message })
                        setFiles([])
                        router.back()
                    }
                    if (data?.success === false) {
                        toast({ title: data.message })
                    }
                }
            }
        } catch (error: any) {
            toast({
                title: "Error Occured",
                description: error.message
            })
        }
    }

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-group my-4 sm:flex-row gap-4 lg:gap-6 justify-center items-center">
                <label className="relative w-1/4 aspect-square overflow-hidden">
                    <Image src={Img} id="profile-avatar" alt="/assets/community.svg" fill className="w-full h-full rounded-full object-cover" />
                </label>
                <input type="file" className="max-w-[300px] text-light-1" onChange={toggleFile} accept='image/*' />
            </div>
            <div className="form-group">
                <label className="label">Name : </label>
                <input type="text" value={communityData.name} name="name" onChange={onchange} className="input" required minLength={3} />
            </div>
            <div className="form-group">
                <label className="label">Unique Id : </label>
                <input type="text" value={communityData.username} name="username" onChange={onchange} className="input" required minLength={6} />
            </div>
            <div className="form-group">
                <label className="label">Bio : <span className="text-light-2 text-small-regular">( Optional )</span> </label>
                <textarea className="input h-auto py-2" value={communityData.bio} name="bio" rows={4} onChange={onchange} />
            </div>
            <div className="form-group">
                <button type="submit" className="btn w-full">Update</button>
            </div>
        </form>
    )
}

export default EditCommunity
