import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/server/actions/user.actions";
import SearchBar from "@/components/form/SearchBar";
import { fetchCommunities } from "@/server/actions/community.actions";
import Pagination from "@/components/Global/Pagination";
import CommunityCard from "@/components/Card/CommunityCard";
import UserMenu from "@/components/Global/UserMenu";

const page = async({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")

    const result = await fetchCommunities({
      searchString: searchParams.q,
      pageNumber: searchParams?.page ? +searchParams.page : 1,
      pageSize: 10,
    });
    // console.log(searchParams?.page)
    return (
    <div className="grid place-items-center gap-4 lg:gap-10">
        <UserMenu avatar={userInfo.image} url={userInfo.id} userId={userInfo._id} />
        <SearchBar path="/communities" />
        <section className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
        {result.communities.length === 0 ? (
          <p className='text-small-regular text-center text-gray-1'>No Communities Found</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>
        <Pagination
        path='/communities'
        search={searchParams?.q || undefined}
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result?.isNext === true ? true : false}
      />
    </div>
  )
}

export default page
