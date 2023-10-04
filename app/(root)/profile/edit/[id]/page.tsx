import { UserProfile } from "@clerk/nextjs"
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Onboard from "@/components/form/Onboard";
import Back from "@/components/Global/Back";
import UserMenu from "@/components/Global/UserMenu";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id)
  if (!userInfo?.onboarded) redirect("/onboarding")
  if(user.id !== userInfo.id) redirect('/')
  const userData = {
    id: user.id,
    username: userInfo.username,
    name: userInfo.name || "",
    bio: userInfo.bio,
    image: userInfo.image,
  };
  return (
    <div className="w-full grid place-items-center gap-6 lg:gap-10">
      <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} />
      <div className="w-full">
        <Back />
      </div>
      <Tabs defaultValue="Basic" className="w-full">
        <TabsList className="w-full bg-dark-2 grid grid-cols-2 min-h-[48px] text-light-2 ">
          <TabsTrigger value="Basic" className='flex gap-1 md:gap-2 h-full'>
            <p className='text-small-regular lg:text-base-regular'>Basic</p>
          </TabsTrigger>
          <TabsTrigger value="Advance" className='flex gap-1 md:gap-2 h-full'>
            <p className='text-small-regular lg:text-base-regular'>Advance</p>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="Basic"
          className='w-full text-light-1 mt-6 lg:mt-10'
        >
          <Onboard user={userData} btnText="Update" />
        </TabsContent>
        <TabsContent
          value="Advance"
          className='w-full text-light-1 user-advance-edit mt-6 lg:mt-10'
        >
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default page
