import ProfileHead from "@/components/Global/ProfileHead";
import { getCommunity } from "@/server/actions/community.actions";
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
import { communityTabs } from "@/constants/nav";
import ThreadTab from "@/components/Global/ThreadTab";
import ProfileCard from "@/components/Card/ProfileCard";
import CommunityFunc from "@/components/Global/CommunityFunc";
import UserMenu from "@/components/Global/UserMenu";


const page = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")
    const comData: any = await getCommunity(params.id, userInfo._id)
    if(!comData) redirect('/')
    const {Data, fucnButton}: any = comData 
    let isCommunity = false
    if (Data.createdBy.toString() === userInfo._id.toString()) {
        isCommunity = true 
    }
   
    return (
        <section className="grid place-items-center gap-6 lg:gap-10">
            <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} />
            <ProfileHead
                accountId={Data._id}
                authUserId={user.id}
                name={Data.name}
                username={Data.username}
                imgUrl={Data.image}
                bio={Data.bio}
                isCommunity={isCommunity}
            />
            <CommunityFunc btnText={fucnButton} communityId={Data._id} userId={userInfo._id} />

            <div className="w-full">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="w-full bg-dark-2 grid grid-cols-2 min-h-[48px] text-light-2 border border-dark-4">
                        {communityTabs.map(tab => {
                            return (
                                <TabsTrigger key={tab.label} value={tab.value} className='flex gap-1 md:gap-2 h-full'>
                                    <Image
                                        src={tab.icon}
                                        alt={tab.label}
                                        width={24}
                                        height={24}
                                        className='object-contain'
                                    />
                                    <p className='max-sm:hidden'>{tab.label}</p>

                                    {tab.label === "Threads" && (
                                        <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                            {Data.threads.length}
                                        </p>
                                    )}
                                    {tab.label === "Members" && (
                                        <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                            {Data.members.length}
                                        </p>
                                    )}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    <TabsContent
                        value="threads"
                        className='w-full text-light-1'
                    >
                        {/* @ts-ignore */}
                        <ThreadTab
                            currentUserId={user.id}
                            dbId={userInfo._id}
                            accountId={Data._id}
                            accountType='Community'
                        />
                    </TabsContent>
                    <TabsContent
                        value="members"
                        className='w-full text-light-1'
                    >
                        {/* @ts-ignore */}
                        <div className="mt-6 lg:mt-10 p-4 lg:p-7 flex flex-col gap-4 lg:gap-7 bg-dark-2 rounded-lg border border-dark-4">
                            {Data && Data.members.length > 0 ? Data.members.map((member: any, index: number) => (
                                <>
                                    <ProfileCard id={member.id} name={member.name} username={member.username} imageUrl={member.image} isAdmin={Data.createdBy.toString() === member._id.toString() ? false : isCommunity} personType="User" adminId={userInfo._id} communityId={Data._id} memberId={member._id} />
                                    {Data.members.length !== (index + 1) ? <span className="w-full h-0.5 bg-dark-4"></span> : <></>}
                                </>
                            )) : <p className="text-small-regular text-center text-gray-1">No communities found</p>}
                        </div>
                    </TabsContent>
                
                </Tabs>

            </div>
        </section>
    )
}

export default page
