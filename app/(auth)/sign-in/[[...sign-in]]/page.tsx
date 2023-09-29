import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
 
export default function Page() {
  return(
    <div className="w-full min-h-screen grid place-items-center">
      <SignIn appearance={{
        baseTheme: dark
      }} />
    </div>
    ) 
    
}