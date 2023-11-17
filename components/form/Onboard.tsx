'use client'
import { updateUser } from "@/server/actions/user.actions"
// import { useUploadThing } from "@/server/uploadthing"
import { usePathname,useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "../ui/use-toast"
import Image from "next/image"
import { useCustomHook } from "../ui/LoaderContext"

// will create interface to avoid use any : or Will create database and send data to it

const Onboard = (props: any) => {
    const pathname = usePathname()
    const router = useRouter()
    const { showLoader, hideLoader }: any = useCustomHook();
    // const {startUpload} = useUploadThing("media")
    const {toast} = useToast()
    // const [Files, setFiles] = useState<File[]>([]);
    const [profileData, setProfileData] = useState({name: props.user.name, bio: props.user.bio} )

    // const toggleFile = (e: any) =>{
    //     if(e.target.files && e.target.files.length > 0){
    //      const  file = e.target.files[0]
    //        var filesize = ((file.size/1024)/1024).toFixed(4)
    //        console.log(parseFloat(filesize))
    //        if(parseFloat(filesize) < 2){
    //           setFiles(Array.from(e.target.files))
    //            const reader:any = new FileReader();
    //            reader.onload = () => {
    //                const imgEle:any = document.querySelector('#profile-avatar')
    //                imgEle.src = reader.result
    //            };
    //            reader.readAsDataURL(file);
    //        }else{
    //         e.target.value = ""
    //         alert("Image is too big only supports below 2mb")
    //        }

    //     }
    // }

    const onchange = (e: any) =>{
        setProfileData({...profileData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e: any) =>{
        e.preventDefault()
        try {
            if(profileData.name  && profileData.name.length >= 3){
                showLoader()
                // let fileUrl = props.user.image
                // if(Files && Files.length > 0){
                //     const data = await startUpload(Files)
                //     if (data && data[0].fileUrl) {
                //         fileUrl = data[0].fileUrl
                //         setFiles([])
                //     }
                // }
                
               const data = await updateUser({
                    name: profileData.name,
                    path: pathname,
                    username: props.user.username,
                    userId: props.user.id,
                    bio: profileData.bio || "",
                    image: props.user.image
                });
                hideLoader()
                if(props.btnText === "Continue"){
                    toast({title: `Welcome ${profileData.name}`})
                    router.push("/")
                }else{
                    toast({title: "Profile Updated"})
                    router.back()
                }
            }else{
                alert("Name should be min 3 charcter long.")
            }
        } catch (error) {
            console.log(error)
        }
    }
    // Todo Have to store database 

    return (
        <form className={`form-container ${props.btnText === "Update" ? "max-w-full": ""}`} onSubmit={handleSubmit}>
            <div className="form-group my-4 sm:flex-row gap-4 lg:gap-6 justify-center items-center">
                <label className=" relative w-1/4 aspect-square overflow-hidden">
                    <Image src={props.user.image} alt="/assets/profile.svg" fill className="w-full h-full rounded-full object-cover"  /> 
                </label>
            </div>
            <div className="form-group">
                <label className="label">Name : </label>
                <input type="text" value={profileData.name} name="name" onChange={onchange} className="input" required minLength={3}/>
            </div>
            <div className="form-group">
                <label className="label">Bio : <span className="text-light-2 text-small-regular">( Optional )</span> </label>
                <textarea className="input h-auto py-2" value={profileData.bio} name="bio" rows={4} onChange={onchange} />
            </div>
            <div className="form-group">
                <button type="submit" className="btn">{props.btnText}</button>
            </div>
        </form>
    )
}

export default Onboard
