'use client'
import {NavData} from '@/constants/nav'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

const BottomBar = () => {
    const pathname = usePathname()
    const {userId} = useAuth()
    return (
        <section className="block w-full md:hidden fixed bottom-0 rounded-tl-xl rounded-tr-xl left-0 z-20  bg-dark-2 border-t border-t-dark-4 px-1 py-1">
            <div className='flex  justify-between w-full'>
                {NavData.map((item, index) => {
                    return (
                        <Link href={item.url} key={index} className={`flex flex-col items-center gap-1 py-2 transition-all hover:bg-primary-500 px-4 xs:px-6 rounded-lg ${pathname === item.url ? "bg-primary-500" : ""}`}>
                            <Image src={item.img} alt='logo' width={20} height={20} />
                        </Link>
                    )
                })}
                  <Link href={`/profile/${userId}`} key={10} className={`flex flex-col items-center gap-1 py-2 transition-all hover:bg-primary-500 px-4 xs:px-6 rounded-lg ${pathname === `/profile/${userId}` ? "bg-primary-500" : ""}`}>
                            <Image src="/assets/user.svg" alt='logo' width={20} height={20} />
                  </Link>
            </div>
        </section>
    )
}

export default BottomBar
