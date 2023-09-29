import { UserProfile } from "@clerk/nextjs"
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id)
  if (!userInfo?.onboarded) redirect("/onboard")

  return (
    <div>
      <UserProfile  />
    </div>
  )
}

export default page
