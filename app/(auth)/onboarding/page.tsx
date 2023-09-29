import Onboard from "@/components/form/Onboard"
import { fetchUser } from "@/server/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//TODO
// Have to Find a way to sync mongoDB and Clerk |||
// Have to revise some data validation to prevent possible errors

const page = async() => {

  const user = await currentUser()
  if(!user) return null;

  const userInfo = await fetchUser(user.id)
  if(userInfo && userInfo.onboarded ) redirect("/")
  
  const userData = {
    id: user.id,
    username:  user.username,
    name:  user.firstName || "",
    bio:  "",
    image: user.imageUrl,
  };

  return (
    <div className='pt-10  grid place-items-center px-4'>
      <h1 className='text-white  text-center lg:text-left text-heading3-bold lg:text-heading1-bold '>Onboarding</h1>
      <p className="text-light-1 text-center lg:text-left text-small-regular lg:text-body-normal my-2 ">Complete process to continue exploring Threads.</p>
      <div className="my-8 max-w-2xl w-full lg:p-8 p-4 bg-dark-3 rounded-xl">
        <Onboard user={userData} />
      </div>
    </div>
  )
}

export default page
