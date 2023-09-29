import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/server/actions/user.actions";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboard")
  const notification = await getActivity(userInfo._id)
  // console.log(notification)
  return (
    <section className="grid place-items-left gap-4 lg:gap-6 w-full">
      {notification && notification.length > 0 ?
        <>
          {notification.map((activity) => (
            <Link key={activity._id} href={activity.parentCommentId ? `/thread/${activity.parentCommentId}` : `/thread/${activity.parentId}`}>
              <article className='flex px-4 py-3 lg:py-4 lg:px-6 bg-dark-2 gap-2 rounded'>
                <Image
                  src={activity.author.image}
                  alt='user_logo'
                  width={20}
                  height={20}
                  className='rounded-full object-cover'
                />
                <p className='!text-small-regular text-light-1'>
                  <span className='mr-1 text-primary-500'>
                    {activity.author.name}
                  </span>{" "}
                  replied to your {activity.parentCommentId ? "comment" : "thread"} 
                </p>
              </article>
            </Link>
          ))}
        </> : <p className="text-small-regular text-center text-gray-1">No User Found</p>}

    </section>
  )
}

export default page
