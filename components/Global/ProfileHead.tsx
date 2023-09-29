import Image from "next/image";
import Link from "next/link";

interface props {
    accountId: string;
    authUserId: string;
    name: string | null | undefined
    username: string
    imgUrl: string
    bio: string | null | undefined
}
const ProfileHead = ({
    accountId, authUserId, name, username, imgUrl, bio
}: props) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <div className="profile-box">
                    <div className="profile-img-box">
                        <Image src={imgUrl} alt="logo" className="rounded-full object-cover shadow-md" fill />
                    </div>
                    <div>
                        <h2 className='profile-name'>
                            {name}
                        </h2>
                        <p className='text-tiny-medium lg:text-base-regular text-gray-1'>@{username}</p>
                    </div>
                </div>
                {accountId === authUserId && (
                    <Link href='/profile/edit'>
                        <div className='flex cursor-pointer gap-3  rounded-lg px-4 py-2 min-w-max bg-dark-3'>
                            <Image
                                src='/assets/edit.svg'
                                alt='logout'
                                width={16}
                                height={16}
                            />

                            <p className='text-light-2 text-tiny-medium lg:text-base-regular hidden xs:block'>Edit</p>
                        </div>
                    </Link>
                )}
            </div>
            <p className='mt-6 max-w-lg text-small-regular lg:text-base-regular text-light-2'>{bio}</p>

            <div className='mt-6 lg:mt10 h-0.5 w-full bg-dark-3' />
        </div>
    )
}

export default ProfileHead
