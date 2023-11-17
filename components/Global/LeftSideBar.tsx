'use client'
import { NavData } from '@/constants/nav'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
interface props {
    isChat?: boolean
}
const LeftSideBar = ({ isChat }: props) => {
    const router = useRouter()
    const pathname = usePathname()
    const { userId } = useAuth()
    return (
        <section className={`min-h-screen min-w-[max] hidden justify-between flex-col sticky top-0 left-0 z-20 md:flex bg-dark-2 px-6 pb-6 border-r border-r-dark-4 max-h-screen`}>
            <div className={`flex  gap-6 flex-col ${isChat === true ? "pt-10" : "pt-28"}`}>
                {isChat && (
                    <Link className="flex items-center px-4 pb-5" href="/">
                        <Image src="/assets/logo.svg" width={32} height={32} className='object-contain' alt="logo" />
                    </Link>
                )}
                {NavData.map((item, index) => {
                    return (
                        <Link href={item.url} key={index} className={`flex items-center gap-4 py-3 transition-all hover:bg-primary-500 px-4 rounded-lg ${pathname === item.url ? "bg-primary-500" : ""}`}>
                            <Image src={item.img} alt='logo' width={24} height={24} />
                            <p className={`${isChat === true ? "hidden" : ""} text-light-1 max-lg:hidden`}>{item.label}</p>
                        </Link>
                    )
                })}
                <Link key={10} href={`/profile/${userId}`} className={`flex items-center gap-4 py-3 transition-all hover:bg-primary-500 px-4 rounded-lg ${pathname === `/profile/${userId}` ? "bg-primary-500" : ""}`}>
                    <Image src='/assets/user.svg' alt='logo' width={24} height={24} />
                    <p className={`text-light-1 max-lg:hidden ${isChat === true ? "hidden" : ""}`}>User</p>
                </Link>
            </div>
            <SignedIn>
                <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                    <div className='flex  gap-4 cursor-pointer rounded-lg py-3 px-4 hover:bg-red-500'>
                        <Image src="/assets/logout.svg" width={24} height={24} alt="logo" />
                        <p className={`text-light-1 max-lg:hidden ${isChat === true ? "hidden" : ""}`}>Log Out</p>
                    </div>
                </SignOutButton>
            </SignedIn>
        </section>
    )
}

export default LeftSideBar
