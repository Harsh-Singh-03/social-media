import { fetchUserPost } from "@/server/actions/user.actions"
import Post from "../Card/Post"

interface props {
    currentUserId: string
    accountId: string
    accountType: string
}
const ThreadTab = async({
    currentUserId, accountId, accountType
}: props) => {

    let result: any;
    if(accountType === 'User'){
      result = await fetchUserPost(accountId)
    }
  return (
    <div className="mt-6 lg:mt-10 flex flex-col gap-4 lg:gap-10">
        {result && result.threads.length > 0 ? result.threads.map((thread: any) => (
        <Post
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
          isComment= {false}
        />
      )): <p className="text-small-regular text-center text-gray-1">Post not fount</p>}
    </div>
  )
}

export default ThreadTab
