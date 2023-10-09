import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/server/actions/user.actions";
import { fetchPosts } from "@/server/actions/thread.actions";
import Post from "@/components/Card/Post";
import Pagination from "@/components/Global/Pagination";
import UserMenu from "@/components/Global/UserMenu";
// import Infinite from "@/components/Home/Infinite";

export default async function Home(
  {
    searchParams,
  }: {
    searchParams: { [key: string]: string | undefined };
  }
) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")
  const postResult:any = await fetchPosts(
    searchParams.page ? +searchParams.page : 1
  );

  return (
    <div className="grid place-items-center gap-4 lg:gap-10">
      <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id}/>
      {postResult?.posts.length === 0 ?
        <p className="text-light-1 text-small-regular">No Posts Found</p> : (
          <>
            {postResult?.posts.map((post: any) => {
              return (
                <Post key={post._id}
                  id={post._id}
                  currentUserDbId={userInfo._id}
                  currentUserId={user.id}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}
                  isComment={false}
                  image={post.image}
                  likes={post.likes}
                />

              )
            })}
          </>
        )
      }
      {/* <Infinite id={user.id}/> */}
      <Pagination
        path='/'
        search={undefined}
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={postResult.isNext}
      />
    </div>

  )
}