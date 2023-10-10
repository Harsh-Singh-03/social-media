import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/server/actions/user.actions";
import Back from "@/components/Global/Back";
import UserMenu from "@/components/Global/UserMenu";
import { getWhoLikes } from "@/server/actions/thread.actions";
import ProfileCard from "@/components/Card/ProfileCard";
import Image from "next/image";


const page = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")
    let Likes = await getWhoLikes(params.id)
    if (Likes?.success === false || !Likes?.Likes || !Likes?.Likes.likes || Likes?.Likes.likes.length < 1) redirect('/')
    // console.log(Likes?.Likes.likes)
    return (
        <div className="grid place-items-center gap-4 lg:gap-10">
            <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} />
            <div className="w-full">
                <Back />
            </div>
            <div className="flex items-center gap-2">
                <p className="text-gray-1 text-small-regular lg:text-base-regular">{Likes.Likes.likes.length} people likes this thread</p>
                <Image src="/assets/heart-filled.svg" alt="logo" width={24} height={24} className="object-contain" />
            </div>
            <div className="p-4 lg:p-7 flex flex-col gap-4 lg:gap-7 bg-dark-2 rounded-lg border border-dark-4 w-full">
                {Likes.Likes.likes.map((person: any, index: number) => {
                    return (
                        <>
                            <ProfileCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imageUrl={person.image}
                                personType='User' />
                            {Likes?.Likes.likes.length !== (index + 1) ? <span className="w-full h-0.5 bg-dark-4"></span> : <></>}
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default page
