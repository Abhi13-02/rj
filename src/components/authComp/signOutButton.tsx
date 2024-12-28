"use client"
import { useSession,signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
 
export default function SignOut() {
  
  const router = useRouter();
  let {data : session} = useSession();

  const handleSignOut = () => {
    router.push("/");
    signOut();
  };

  return (
    <div>
      {session ? <button onClick={handleSignOut}>Logout</button> : <p>Not signed in</p>}
    </div>
  )
} 