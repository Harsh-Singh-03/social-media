"use client"
import Image from "next/image";
import Link from "next/link";
import { useLoader } from "../ui/LoaderContext";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { removeMember } from "@/server/actions/community.actions";

interface props {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  isAdmin?: boolean | undefined | null;
  personType: string
  adminId?: any
  communityId?: any
  memberId?: any
}
const ProfileCard = ({ id, name, username, imageUrl, isAdmin, personType, adminId, communityId, memberId }: props) => {
  const path = usePathname()
  const { toast } = useToast()
  const { hideLoader, showLoader }: any = useLoader()
  const isCommunity = personType === "Community";

  const kickMember = async () => {
    showLoader()
    const data = await removeMember(adminId, memberId, communityId, "kick", path)
    hideLoader()
    console.log(data)
    if (data?.success) {
      toast({ title: data?.message })
    }
  }
  return (
    <article className="flex justify-between items-center w-full">
      <div className="profile-box">
        <div className="profile-img-box w-11 h-11 lg:w-16 lg:h-16">
          <Image src={imageUrl} alt="logo" className="rounded-full object-cover shadow-md" fill />
        </div>
        <div>
          <h2 className='text-light-1 text-small-regular lg:text-body-semibold  tracking-normal'>
            {name}
          </h2>
          <p className='text-tiny-medium lg:text-base-regular text-gray-1'>@{username}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Link href={isCommunity ? `/communities/${id}` : `/profile/${id}`} className="btn px-4 mt-0 text-light-2 text-tiny-medium lg:text-base-regular">View</Link>
        {isAdmin === true && (
          <button className="btn px-4 mt-0 bg-logout-btn hover:bg-logout-btn/80 text-light-2 text-tiny-medium lg:text-base-regular" onClick={kickMember}>Kick</button>
        )}
      </div>
    </article>
  )
}

export default ProfileCard
