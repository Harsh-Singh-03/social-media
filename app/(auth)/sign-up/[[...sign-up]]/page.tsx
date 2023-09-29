import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
 
export default function Page() {
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <SignUp appearance={{
        baseTheme: dark
      }}/>
    </div>

  )
}