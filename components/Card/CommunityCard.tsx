import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    members: {
        image: string;
    }[];
}

function CommunityCard({ id, name, username, imgUrl, bio, members }: Props) {
    return (
        <article className='community-card w-full rounded-lg bg-dark-3 px-4 py-5 border border-dark-4'>
            <div className='flex flex-wrap items-center gap-3'>
                <Link href={`/communities/${id}`} className='relative h-12 w-12'>
                    <Image
                        src={imgUrl}
                        alt='community_logo'
                        fill
                        className='rounded-full object-cover'
                    />
                </Link>

                <div>
                    <Link href={`/communities/${id}`}>
                        <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    </Link>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>

            <p className='mt-4 text-subtle-medium text-gray-1'>{bio.length < 180 ? bio : bio.slice(0, 180)} {bio.length > 180 ? "..." : ''}</p>

            <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
                <Link href={`/communities/${id}`}>
                    <button className='btn text-small-regular px-4 mt-0'>
                        View
                    </button>
                </Link>

                {members.length > 0 && (
                    <div className='flex items-center'>
                        {members.map((member, index) => (
                            index < 3 && (
                                <div className="relative w-6 h-6 object-cover rounded-full">
                                    <Image
                                        key={index}
                                        src={member.image}
                                        alt={`user_${index}`}
                                        fill
                                        className={`${index !== 0 && "-ml-2"
                                            } rounded-full object-cover`}
                                    />

                                </div>
                            )
                        ))}
                        {members.length > 3 && (
                            <p className='ml-1 text-subtle-medium text-gray-1'>
                                {members.length}+ members
                            </p>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

export default CommunityCard;