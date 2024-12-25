"use client"
import { useSession,signIn } from "next-auth/react"
 
export default function SignIn() {

  let {data : session} = useSession();


  return (
    <div>
      {session ? <p>signed in as {session.user?.email} and ID is {session.user?.id}</p> : <button onClick={() => signIn("google")} className=" ring-1 ring-white px-4 py-2 rounded-2xl text-white">Login</button>}  
    </div>
  )
} 