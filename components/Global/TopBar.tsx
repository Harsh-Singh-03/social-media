'use client'
import { SignedIn, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";

function TopBar() {

    const router = useRouter()

    return (
        <nav className="fixed top-0 w-full left-0 flex justify-between px-4 sm:px-6 py-3 bg-dark-2 z-30 border-b border-b-dark-4" >
            <Link className="flex gap-4 items-center" href="/">
                <Image src="/assets/logo.svg" width={24} height={24} alt="logo" />
                <p className="text-light-1 text-heading3-bold">Threads</p>
            </Link>
            <div className="flex gap-4 items-center">
                <div className="md:hidden block mr-24">
                    <SignedIn>
                        <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                            <Image className="cursor-pointer" src="/assets/logout.svg" width={24} height={24} alt="logo" />
                        </SignOutButton>
                    </SignedIn>

                </div>
            </div>
        </nav>
    )
}
export default TopBar