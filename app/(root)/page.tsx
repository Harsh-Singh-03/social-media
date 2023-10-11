import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/server/actions/user.actions";
import UserMenu from "@/components/Global/UserMenu";
import HomePost from "@/components/Infitine-Scroll/Home";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  return (
    <div className="grid place-items-center gap-4 lg:gap-10">
      <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id}/>
      <HomePost userInfo={userInfo._id} user={user.id} />
    </div>

  )
}