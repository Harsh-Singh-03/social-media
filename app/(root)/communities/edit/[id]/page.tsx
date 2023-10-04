import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getCommunity } from "@/server/actions/community.actions";
import UserMenu from "@/components/Global/UserMenu";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const {Data, fucnButton}: any = await getCommunity(params.id, userInfo._id)
  if(!Data || Data.createdBy.toString() !== userInfo._id.toString()) redirect('/')

  return (
    <div className="grid place-items-center gap-6 lg:gap-10">
        <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} />
    </div>
  )
}

export default page
