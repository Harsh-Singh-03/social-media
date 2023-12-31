import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/server/actions/user.actions";
import { fetchThread } from "@/server/actions/thread.actions";
import Post from "@/components/Card/Post";
import Comment from "@/components/form/Comment";
import Back from "@/components/Global/Back";
import UserMenu from "@/components/Global/UserMenu";


const page = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")
    const Thread = await fetchThread(params.id)
    if (!Thread) redirect("/")
    const mainThreadId = Thread.parentId ? Thread.parentId : params.id
    const commentId = Thread.parentCommentId ? Thread.parentCommentId : params.id
    const isReply = mainThreadId === commentId ? false : true

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
        <div className="grid place-items-center gap-4 lg:gap-10">
            <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} chatUsers={chatUser} />
            <div className="w-full">
                <Back />
            </div>
            {!Thread ?
                <p className="text-light-1 text-small-regular">No Thread Found</p> : (
                    <>
                        <Post key={Thread._id}
                            id={Thread._id}
                            currentUserId={user.id}
                            currentUserDbId={userInfo._id}
                            parentId={Thread.parentId}
                            content={Thread.text}
                            author={Thread.author}
                            community={Thread.community}
                            createdAt={Thread.createdAt}
                            comments={Thread.children}
                            image={Thread.image}
                            likes={Thread.likes}
                            isComment={false} />
                        <Comment threadId={mainThreadId} commentId={commentId} IsReply={isReply} currentUserId={userInfo._id} currentUserImg={userInfo.image} community={Thread.community && Thread.community._id ? Thread.community._id : null } />
                        <div className="w-full">
                            {Thread.children.length > 0 && Thread.children.map((childItem: any) => (
                                <Post
                                    key={childItem._id}
                                    id={childItem._id}
                                    currentUserId={user.id}
                                    currentUserDbId={userInfo._id}
                                    parentId={childItem.parentId}
                                    content={childItem.text}
                                    author={childItem.author}
                                    community={childItem.community}
                                    createdAt={childItem.createdAt}
                                    comments={childItem.children}
                                    isComment={true}
                                    likes={childItem.likes}
                                    isReply={isReply}
                                />
                            ))}
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default page
