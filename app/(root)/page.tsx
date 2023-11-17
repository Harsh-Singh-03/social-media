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

  let chatUser = false;
  if(userInfo.chatUsers && userInfo.chatUsers.length > 0){
    userInfo.chatUsers.forEach((user: any) =>{
      if(user.messageStatus !== 'seen' && user.messageAuthor !== 'Sender' ){
        chatUser = true
        return;
      }
    })
  }else{
    chatUser = false
  }

  return (
    <div className="grid place-items-center gap-4 lg:gap-10">
      <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} chatUsers={chatUser} />
      <HomePost userInfo={userInfo._id} user={user.id} />
    </div>

  )
}