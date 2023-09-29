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
        <div className="profile-img-box lg:w16 lg:16">
          <Image src={imageUrl} alt="logo" className="rounded-full object-cover shadow-md" fill />
        </div>
        <div>
          <h2 className='profile-name'>
            {name}
          </h2>
          <p className='text-tiny-medium lg:text-base-regular text-gray-1'>@{username}</p>
        </div>
      </div>
      <Link href={isCommunity ? `/communities/${id}` : `/profile/${id}`} className="btn px-4 mt-0">View</Link>
    </article>
  )
}

export default ProfileCard
