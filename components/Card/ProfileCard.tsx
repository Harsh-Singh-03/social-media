import Image from "next/image";
import Link from "next/link";

interface props {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  personType: string
}
const ProfileCard = ({ id, name, username, imageUrl, personType }: props) => {
  const isCommunity = personType === "Community";
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
      <Link href={isCommunity ? `/communities/${id}` : `/profile/${id}`} className="btn px-4 mt-0 text-light-2 text-tiny-medium lg:text-base-regular">View</Link>
    </article>
  )
}

export default ProfileCard
