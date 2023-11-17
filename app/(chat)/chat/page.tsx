
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ChatSideBar from "@/components/Chat/ChatSideBar";
import Empty from "@/components/Chat/Empty";
import { fetchUser } from "@/server/actions/user.actions";

export default async function Page() {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")
    return (
        <div className="flex">
            {/* <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} /> */}
            <ChatSideBar username={user?.username} avatar={userInfo.image} userId={user.id} userDbId={userInfo._id} />
            <Empty/>
        </div>
    )
}
