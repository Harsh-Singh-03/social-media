'use client'
import Image from "next/image"
import Link from "next/link"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateCommunity from "../form/CreateCommunity"

interface props {
    avatar: string;
    url: string;
    userId: string
}
function UserMenu({ avatar, url, userId }: props) {

    return (
        <div className="fixed top-3 right-4 md:right-8 z-40">
            <Popover>
                <PopoverTrigger className="relative object-cover w-8 h-8 rounded-full">
                    <Image className="cursor-pointer object-cover rounded-full" fill src={avatar} alt="logo" />
                </PopoverTrigger>
                <PopoverContent className="bg-dark-2 max-w-max px-6 border-none mr-2 lg:mr-0">
                    <div className="grid gap-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <p className="text-light-1 pb-2 text-small-regular border-b border-b-primary-500 cursor-pointer"><span className="mr-1 text-heading4-medium text-primary-500">+</span> Create Community</p>
                            </DialogTrigger>
                            <DialogContent className="bg-dark-2 text-light-1 w-[92%] border-none rounded-md p-0">
                                <CreateCommunity userId={userId} />
                            </DialogContent>
                        </Dialog>
                        <Link href={`/profile/${url}`} className="cursor-pointer">
                            <p className="text-center text-gray-1 text-small-regular">Go To Profile</p>
                        </Link>
                    </div>
                </PopoverContent>
            </Popover> 
        </div>

    )
}
export default UserMenu