import UserMenu from "@/components/Global/UserMenu";
import CreateThread from "@/components/form/CreateThread";
import { fetchUser, fetchUserCommunity } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const page = async () => {
  const user = await currentUser()
  if (!user) return null;

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")
  let dataArr: any = []
  const result = await fetchUserCommunity(userInfo.id)

  console.log(Array.isArray(result.communities))
  if (result && result.communities.length > 0) {
    result.communities.forEach((element: any) => {
      let obj = { id: element._id, name: element.name, image: element.image }
      dataArr.push(obj)
    });
  }
  let chatUser = false;
  if (userInfo.chatUsers && userInfo.chatUsers.length > 0) {
    userInfo.chatUsers.forEach((user: any) => {
      if (user.messageStatus !== 'seen' && user.messageAuthor !== 'Sender') {
        chatUser = true
        return;
      }
    })
  } else {
    chatUser = false
  }

  return (
    <div className="grid place-items-center gap-6 lg:gap-10">
      <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} chatUsers={chatUser} />
      <h1 className="text-light-1 text-center text sm:text-left text-heading2-bold ">Create Thread </h1>
      <CreateThread userId={userInfo._id} data={dataArr} />
    </div>
  )
}

export default page
