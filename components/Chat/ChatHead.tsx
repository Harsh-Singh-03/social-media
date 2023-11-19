"use client"
import Image from "next/image"
import UserMenu from "../Global/UserMenu";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface props {
    username: string
    avatar: string;
    userId: string;
    userDbId: string;
}
const ChatHead = ({ username, avatar, userDbId, userId }: props) => {
    const router = useRouter()
    return (
        <div className="pt-6 md:pt-10 px-4 flex justify-between items-center border-b border-b-dark-4 pb-6 md:pb-4">
            <div className="flex items-center gap-4">
                <Image src='/assets/left-arrow.svg' alt="back" width={24} height={24} className="object-contain cursor-pointer mr-2" onClick={() => router.back()} />
                <UserMenu avatar={avatar} url={userId} userId={userDbId} isChat={true} />
                <Link href={`/profile/${userId}`}>
                    <p className="text-primary-500 text-base-regular">{username}</p>
                </Link>
            </div>
            <div className="flex gap-4 items-center">
                <Link href={`/search`}>
                    <Image src="/assets/search-gray.svg" alt="logo" width={24} height={24} className="object-contain cursor-pointer" />
                </Link>
                {/* <Image src="/assets/more.svg" alt="logo" width={24} height={24} className="object-contain cursor-pointer" /> */}

            </div>
        </div>
    )
}

export default ChatHead
