import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/server/actions/user.actions";
import { fetchThread } from "@/server/actions/thread.actions";
import Post from "@/components/Card/Post";
import Comment from "@/components/form/Comment";
import Back from "@/components/Global/Back";


const page = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboard")
    const Thread = await fetchThread(params.id)
    if(!Thread) redirect("/")
    const mainThreadId = Thread.parentId ? Thread.parentId : params.id
    const commentId = Thread.parentCommentId ? Thread.parentCommentId : params.id
    const isReply = mainThreadId === commentId ? false : true
    // console.log(mainThreadId) For this I have to update route..
    // console.log(JSON.stringify(Thread))
    // Thread.parentId ? true : false That is accurte to check comment
    return (
        <div className="grid place-items-center gap-4 lg:gap-10">
            {/* {isReply && ()} */}
            <div className="w-full">
                <Back/>
            </div>
            {!Thread ?
                <p className="text-light-1 text-small-regular">No Thread Found</p> : (
                    <>
                        <Post key={Thread._id}
                            id={Thread._id}
                            currentUserId={user.id}
                            parentId={Thread.parentId}
                            content={Thread.text}
                            author={Thread.author}
                            community={Thread.community}
                            createdAt={Thread.createdAt}
                            comments={Thread.children}
                            isComment={false} />
                        <Comment threadId={mainThreadId} commentId={commentId} IsReply={isReply} currentUserId={userInfo._id} currentUserImg={userInfo.image}/>
                        <div className="w-full">
                        {Thread.children.length > 0 && Thread.children.map((childItem: any) => (
                            <Post
                                key={childItem._id}
                                id={childItem._id}
                                currentUserId={user.id}
                                parentId={childItem.parentId}
                                content={childItem.text}
                                author={childItem.author}
                                community={childItem.community}
                                createdAt={childItem.createdAt}
                                comments={childItem.children}
                                isComment={true}
                                isReply ={isReply}
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
