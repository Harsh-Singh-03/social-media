import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/server/actions/user.actions";
import ProfileCard from "@/components/Card/ProfileCard";
import SearchBar from "@/components/form/SearchBar";
import Pagination from "@/components/Global/Pagination";
import UserMenu from "@/components/Global/UserMenu";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect("/onboarding")

  const result = await fetchUsers({ userId: user.id, searchString: searchParams?.q, pageNumber: searchParams?.page ? +searchParams.page : 1 })
  // console.log(result)
  return (
    <div className="grid place-items-center gap-4 lg:gap-10">
      <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} />
      <SearchBar path="/search" />
      {result?.users.length === 0 ? <p className="text-small-regular text-center text-gray-1">No User Found</p> :
        result?.users.map(person => {
          return (
            <ProfileCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imageUrl={person.image}
              personType='User' />
          )
        })
      }
      <Pagination
        path='/search'
        search={searchParams?.q || undefined}
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result?.isNext === true ? true : false}
      />
    </div>
  )
}

export default page
