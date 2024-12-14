"use client"
import { useSession,signIn } from "next-auth/react"
 
export default function SignIn() {

  let {data : session} = useSession();


  return (
    <div>
      {session ? <p>signed in as {session.user?.email}</p> : <button onClick={() => signIn("google")} className="bg-blue-500 px-4 py-2 rounded">Signin with Google</button>}  
    </div>
  )
} 