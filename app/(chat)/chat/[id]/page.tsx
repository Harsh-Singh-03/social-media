import ChatSideBar from "@/components/Chat/ChatSideBar";
import MainChat from "@/components/Chat/MainChat";
import { updateChatList } from "@/server/actions/message.actions";
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const page = async({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")
    const result = await updateChatList(params.id)
  return (
    <div className="flex w-full overflow-x-hidden">
      <ChatSideBar username={user?.username} paramsId={params.id} avatar={userInfo.image} userId={user.id} userDbId={userInfo._id} />
      <MainChat currentUserId={userInfo._id} chatUserId={params.id} image={result?.Data.image} name={result?.Data.name}  />
    </div>
  )
}

export default page
