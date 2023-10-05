import { fetchCommunities } from "@/server/actions/community.actions"
import ProfileCard from "../Card/ProfileCard"


const RightSideBar = async() => {
  const result = await fetchCommunities({pageSize: 5})

  return (
    <section className="min-h-screen min-w-[350px] hidden justify-between flex-col sticky top-0 right-0 z-20 xl:flex bg-dark-2 px-6 pb-6 border-r border-r-dark-4 max-h-screen">
        <div className="pt-20 flex flex-col gap-4 lg:gap-7">
            {result && result.communities.length > 0 ? result.communities.map((member: any, index: number) => (
                <>
                    <ProfileCard id={member._id} name={member.name} username={member.username} imageUrl={member.image} personType="Community" />
                    {result.communities.length !== (index + 1) ? <span className="w-full h-0.5 bg-dark-4"></span> : <></>}
                </>
            )) : <p className="text-small-regular text-center text-gray-1">No communities found</p>}
        </div>
    </section>
  )
}

export default RightSideBar
