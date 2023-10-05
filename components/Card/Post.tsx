
import Image from "next/image";
import Link from "next/link";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import DeleteThread from "../Global/DeleteThread";
import EditThread from "../Global/EditThread";
import Share from "../Global/Share";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        _id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        };
    }[];
    isComment?: boolean;
    isReply?: boolean;
    image?: string | undefined | null
}
const Post = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
    isReply,
    image
}: Props) => {
    let mongodbDate = new Date(createdAt)
    // Using toLocaleString() with custom options for a specific format
    const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
    const customDateString = mongodbDate.toLocaleString('en-US', options);

    return (
        <article className={`relative rounded-lg  ${isComment === false ? "bg-dark-2 p-4 lg:p-7 border border-dark-4" : "pl-2 lg:pl-4"} w-full`}>
            {author.id === currentUserId && (
                <>
                    <Popover>
                        <PopoverTrigger className={`absolute ${!isComment ? "right-4 top-2" : "right-0 -top-1"} `}>
                            <Image src='/assets/more.svg' alt="more" height={24} width={24} className="cursor-pointer object-contain" />
                        </PopoverTrigger>
                        <PopoverContent className="bg-dark-4 max-w-max px-6 border-none mr-2 lg:mr-0">
                            <div className="grid place-content-center gap-4">
                                <EditThread id={id} text={content} />
                                <span className="border-b border-b-primary-500"></span>
                                <DeleteThread id={id} />
                            </div>
                        </PopoverContent>
                    </Popover>

                </>
            )}

            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <Link href={`/profile/${author.id}`} className="w-11 h-11 relative object-cover rounded-full">
                        <Image src={author.image} alt="profile" fill className="rounded-full object-cover cursor-pointer shadow-md" />
                    </Link>
                    <div className="relative mt-2 w-0.5 grow rounded-full bg-neutral-800"></div>
                </div>
                <div className="flex flex-col w-full">
                    <Link href={`/profile/${author.id}`} className="w-fit">
                        <h4 className="text-light-1 text-small-regular lg:text-base-medium cursor-pointer tracking-wider">{author.name}</h4>
                    </Link>
                    {/* TODO */}
                    <div className="flex flex-col sm:flex-row sm:gap-6">
                    {image && (
                        <div className="w-full sm:w-[35%] sm:min-w-[35%] mt-4 object-contain">
                            <Image src={image} alt="post" width={300} height={100}  className="w-full h-auto object-contain rounded-md"/>
                        </div>
                    )}
                    <p className={`mt-2 text-subtle-medium sm:text-small-regular text-light-2 tracking-wider ${image && 'mt-5'}`}>{content}</p>

                    </div>
                    {isReply !== true && (
                        <div className={`flex gap-3.5 mt-3 ${isComment && comments.length === 0 && "pb-4 lg:pb-7"}`}>
                            <Image
                                src='/assets/heart-gray.svg'
                                alt='heart'
                                width={24}
                                height={24}
                                className='cursor-pointer object-contain'
                            />
                            <Link href={`/thread/${id}`}>
                                <Image
                                    src='/assets/reply.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                            </Link>
                            {/* <Image
                                src='/assets/repost.svg'
                                alt='heart'
                                width={24}
                                height={24}
                                className='cursor-pointer object-contain'
                            /> */}
                            <Share id={id} content={content} />
                        </div>
                    )}
                    {isComment && comments.length > 0 && (
                        <Link href={`/thread/${id}`}>
                            <p className='mt-3 text-subtle-medium text-gray-1 pb-4 lg:pb-7'>
                                {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                            </p>
                        </Link>
                    )}
                    {isReply === true && (
                        <p className="text-gray-1 text-subtle-medium cursor-pointer lg:text-small-medium mt-1 pb-4 lg:pb-7">reply</p>
                    )}
                </div>
            </div>
            {!isComment && comments && comments.length > 0 && (
                <div className='ml-1 flex mt-3 items-center gap-2'>
                    {comments.slice(0, 2).map((comment, index) => (
                        <div className="relative w-6 h-6 rounded-full object-cover">
                            <Image
                                key={index}
                                src={comment.author.image}
                                alt={`user_${index}`}
                                fill
                                className={`${index !== 0 && "-ml-5 -mb-1"} rounded-full object-cover shadow-sm`}
                            />
                        </div>
                    ))}

                    <Link href={`/thread/${id}`}>
                        <p className={`text-subtle-medium text-gray-1 ${comments.length > 1 ? '-ml-4' : 'ml-0.5'}`}>
                            {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                        </p>
                    </Link>
                </div>
            )}

            <div className="flex gap-2 items-center mt-3 flex-wrap">
                {!isComment && createdAt && (
                    <>
                        <p className='text-subtle-medium text-gray-1'>
                            {customDateString}
                        </p>
                        {!isComment && community && (
                            <Link
                                href={`/communities/${community._id}`}
                                className='flex items-center'
                            >
                                <p className='text-subtle-medium text-gray-1'>
                                    {community && ` - ${community.name} Community`}
                                </p>

                                <Image
                                    src={community.image}
                                    alt={community.name}
                                    width={14}
                                    height={14}
                                    className='ml-1 rounded-full object-cover'
                                />
                            </Link>
                        )}
                    </>
                )}
            </div>

        </article>
    )
}

export default Post
