import { UserProfile } from "@clerk/nextjs"
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Onboard from "@/components/form/Onboard";
import Back from "@/components/Global/Back";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const userData = {
    id: user.id,
    username:  userInfo.username,
    name:  userInfo.name || "",
    bio:  userInfo.bio,
    image: userInfo.image,
  };
  return (
    <div className="w-full grid place-items-center gap-6 lg:gap-10">
      <div className="w-full">
        <Back/>
      </div>
      <Tabs defaultValue="Basic" className="w-full">
        <TabsList className="w-full bg-dark-2 grid grid-cols-2 min-h-[44px] text-light-2 ">
          <TabsTrigger value="Basic" className='flex gap-1 md:gap-2'>
            <p className='text-small-regular lg:text-base-regular'>Basic</p>
          </TabsTrigger>
          <TabsTrigger value="Advance" className='flex gap-1 md:gap-2'>
            <p className='text-small-regular lg:text-base-regular'>Advance</p>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="Basic"
          className='w-full text-light-1'
        >
          <Onboard user={userData} btnText="Update" />
        </TabsContent>
        <TabsContent
          value="Advance"
          className='w-full text-light-1 user-advance-edit'
        >
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default page
