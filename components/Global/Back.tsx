"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

const Back = () => {
    
    const router = useRouter()

    return (
        <div className="px-4 py-1 flex w-max bg-dark-4 rounded" onClick={() => router.back()}>
            <Image
                src='/assets/repost.svg'
                alt='heart'
                width={24}
                height={24}
                className='cursor-pointer object-contain -scale-x-100'/>
        </div>
    )
}

export default Back
