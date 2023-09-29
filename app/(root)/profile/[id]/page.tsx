import ProfileHead from "@/components/Global/ProfileHead";
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from '@/constants/nav'
import Image from "next/image";
import ThreadTab from "@/components/Global/ThreadTab";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id)
  if (!userInfo?.onboarded) redirect("/onboard")
  // TODO Profile and Edit profile and also Sync
  return (
    <section className="grid place-items-center gap-6 lg:gap-10">
      <ProfileHead
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="w-full">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="w-full bg-dark-2 grid grid-cols-3 min-h-[46px] text-light-2 ">
            {profileTabs.map(tab => {
              return (
                <TabsTrigger key={tab.label} value={tab.value} className='flex gap-1 md:gap-2'>
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
                      {userInfo.threads.length}
                    </p>
                  )}
                </TabsTrigger>

              )
            })}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              <ThreadTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType='User'
              />
            </TabsContent>
          ))}
        </Tabs>

      </div>

    </section>
  )
}

export default page
