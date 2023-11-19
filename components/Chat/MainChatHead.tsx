"use client"
import { useChatHook } from "@/Context/ChatContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface props {
    name: string;
    image: string;
    chatUser: string
}
const MainChatHead = ({ name, image, chatUser }: props) => {
    const [isSearchDisplay, setIsSearchDisplay] = useState(false)
    const router = useRouter()
    const { searchString, setSearchString, setMessage, setPage }: any = useChatHook()
    const handleSubmit = (e: any) => {
        e.preventDefault()
        setPage(1)
        setMessage([])
    }
    return (
        <div className="p-4 border-b border-b-dark-4 bg-dark-2 flex justify-between">
            {isSearchDisplay === false ? (
                <>
                    <div className="flex items-center gap-4">
                        <Image src='/assets/left-arrow.svg' alt="back" width={24} height={24} className="block lg:hidden object-contain cursor-pointer mr-2" onClick={() => router.back()} />
                        <Link href={`/profile/${chatUser}`} className="profile-img-box w-11 h-11">
                            <Image src={image} alt="logo" className="rounded-full object-cover shadow-md" fill />
                        </Link>
                        <div className="mt-1">
                            <h2 className='text-light-1 text-base-semibold tracking-wider'>
                                {name}
                            </h2>
                        </div>
                    </div>
                    <div className="flex gap-5 items-center">
                        <Image src="/assets/search.svg" alt="logo" width={20} height={20} className="object-contain cursor-pointer" onClick={() => setIsSearchDisplay(true)} />
                        <Image src="/assets/phone.svg" alt="logo" width={20} height={20} className="object-contain cursor-pointer" />
                        <Image src="/assets/video.svg" alt="logo" width={20} height={20} className="object-contain cursor-pointer" />
                    </div>
                </>
            ) : (
                <div className="flex gap-2 lg:gap-4 items-center w-full animation-top-class">
                    <button className="p-2 lg:p-3 min-w-max rounded-full bg-dark-3 outline-none border-none cursor-pointer" onClick={() => setIsSearchDisplay(false)}>
                        <Image src="/assets/cross.svg" alt="logo" width={20} height={20} className="object-contain cursor-pointer w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <form onSubmit={handleSubmit} className="flex gap-2 lg:gap-4 items-center flex-1">
                        <input type="text" placeholder="search message .." value={searchString} className="input p-4 flex-1 bg-dark-4" onChange={(e) => setSearchString(e.target.value)} />
                        <button type="submit" className="p-2 lg:p-3 min-w-max rounded-full bg-dark-3 outline-none border-none cursor-pointer">
                            <Image src="/assets/search.svg" alt="logo" width={20} height={20} className="object-contain cursor-pointer w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                    </form>
                </div>
            )
            }
        </div>
    )
}

export default MainChatHead
