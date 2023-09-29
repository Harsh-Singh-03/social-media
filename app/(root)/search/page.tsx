import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/server/actions/user.actions";
import ProfileCard from "@/components/Card/ProfileCard";
import SearchBar from "@/components/form/SearchBar";

const page = async() => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboard")
    const result = await fetchUsers({userId: user.id})
    // console.log(result)
    return (
    <div className="grid place-items-center gap-4 lg:gap-10">
      <SearchBar/>
      {result?.users.length === 0 ? <p className="text-small-regular text-center text-gray-1">No User Found</p> : 
      result?.users.map(person =>{
        return (
          <ProfileCard     
          key={person.id}
          id={person.id}
          name={person.name}
          username={person.username}
          imageUrl={person.image}
          personType='User'/>
        )
      })
      }
    </div>
  )
}

export default page
