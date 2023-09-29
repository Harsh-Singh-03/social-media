import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/server/actions/user.actions";

const page = async() => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboard")
    return (
    <div>
      <h1 className="text-light-1">Communities</h1>
    </div>
  )
}

export default page
