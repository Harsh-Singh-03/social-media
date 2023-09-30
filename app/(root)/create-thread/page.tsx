import CreateThread from "@/components/form/CreateThread";
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const page = async() => {
  const user = await currentUser()
  if(!user) return null;

  const userInfo = await fetchUser(user.id)
  if( !userInfo?.onboarded ) redirect("/onboard")
  return (
    <div className="grid place-items-center gap-6 lg:gap-10">
      <h1 className="text-light-1 text-center text sm:text-left text-heading2-bold ">Create Thread </h1>
      <CreateThread userId={userInfo._id}/>
    </div>
  )
}

export default page
