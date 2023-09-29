'use client'
import { updateUser } from "@/server/actions/user.actions"
import { useUploadThing } from "@/server/uploadthing"
import { usePathname,useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "../ui/use-toast"

// will create interface to avoid use any : or Will create database and send data to it

const Onboard = (props: any) => {
    const pathname = usePathname()
    const router = useRouter()
    const {startUpload} = useUploadThing("media")
    const {toast} = useToast()
    const [Files, setFiles] = useState<File[]>([]);
    const [profileData, setProfileData] = useState({name: props.user.name,username: props.user.username, bio: props.user.bio} )

    const toggleFile = (e: any) =>{
        if(e.target.files && e.target.files.length > 0){
         const  file = e.target.files[0]
           var filesize = ((file.size/1024)/1024).toFixed(4)
           console.log(parseFloat(filesize))
           if(parseFloat(filesize) < 2){
              setFiles(Array.from(e.target.files))
               const reader:any = new FileReader();
               reader.onload = () => {
                   const imgEle:any = document.querySelector('#profile-avatar')
                   imgEle.src = reader.result
               };
               reader.readAsDataURL(file);
           }else{
            e.target.value = ""
            alert("Image is too big only supports below 2mb")
           }

        }
    }

    const onchange = (e: any) =>{
        setProfileData({...profileData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e: any) =>{
        console.log(props.user.image)
        e.preventDefault()
        try {
            if(profileData.name && profileData.username && profileData.name.length >= 3 && profileData.username.length >= 8){
                let fileUrl = props.user.image
                if(Files && Files.length > 0){
                    const data = await startUpload(Files)
                    if (data && data[0].fileUrl) {
                        fileUrl = data[0].fileUrl
                        setFiles([])
                    }
                }
                await updateUser({
                    name: profileData.name,
                    path: pathname,
                    username: profileData.username,
                    userId: props.user.id,
                    bio: profileData.bio || "",
                    image: fileUrl
                });
                toast({title: "Welcome"})
                router.push("/")
            }else{
                alert("Check name and username field")
            }
        } catch (error) {
            console.log(error)
        }
    }
    // Todo Have to store database 

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-group my-4 sm:flex-row gap-4 lg:gap-6 items-center">
                <label className="w-1/4 aspect-square overflow-hidden">
                  {props.user.image ? 
                    <img src={props.user.image} id="profile-avatar" alt="avatar" className="w-full h-full rounded-full object-cover"  /> 
                   :
                    <img src="/assets/profile.svg" id="profile-avatar" alt="avatar" className="w-full h-full rounded-full object-cover" /> 
                  }
                </label>
                <input type="file" className="cursor-pointer text-light-1 w-full" onChange={toggleFile} max={2} name="myImage" accept="image/*" />
            </div>
            <div className="form-group">
                <label className="label">Name : </label>
                <input type="text" value={profileData.name} name="name" onChange={onchange} className="input" required minLength={3}/>
            </div>
            <div className="form-group">
                <label className="label">Username : </label>
                <input type="text" value={profileData.username} name="username" onChange={onchange} className="input" minLength={8} />
            </div>
            <div className="form-group">
                <label className="label">Bio : <span className="text-light-2 text-small-regular">( Optional )</span> </label>
                <textarea className="input h-auto py-2" value={profileData.bio} name="bio" rows={4} onChange={onchange} />
            </div>
            <div className="form-group">
                <button type="submit" className="btn">Submit</button>
            </div>
        </form>
    )
}

export default Onboard
