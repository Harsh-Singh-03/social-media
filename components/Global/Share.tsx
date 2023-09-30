"use client"
import Image from "next/image";

interface props {
    id: string;
    content: string
}
const Share = ({ id, content }: props) => {

    const sharePost = async () => {
        const shareData = {
            title: "Thread",
            text: content.length > 100 ? content.slice(0, 100) : content,
            url: `https://social-media-smoky-sigma.vercel.app/thread/${id}`
        }
        try {
            await navigator.share(shareData);
        } catch (err: any) {
            console.log(err.message)
        }
    }

    return (
        <Image
            src='/assets/share.svg'
            alt='share'
            width={24}
            height={24}
            className='cursor-pointer object-contain'
            onClick={sharePost}
        />
    )
}

export default Share
