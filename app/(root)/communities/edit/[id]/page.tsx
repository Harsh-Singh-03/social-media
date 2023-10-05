import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getCommunity } from "@/server/actions/community.actions";
import UserMenu from "@/components/Global/UserMenu";
import EditCommunity from "@/components/form/EditCommunity";
import Back from "@/components/Global/Back";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const comData: any = await getCommunity(params.id, userInfo._id)
  if (!comData) redirect('/')
  const { Data }: any = comData
  if (!Data || Data.createdBy.toString() !== userInfo._id.toString()) redirect('/')

  return (
    <section className="grid place-items-center gap-6 lg:gap-10">
      <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} />
      <div className="w-full">
        <Back />
      </div>
      <EditCommunity adminId={userInfo._id} image={Data.image} name={Data.name} username={Data.username} bio={Data.bio} />
    </section>
  )
}

export default page
