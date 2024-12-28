"use client"
import { useSession,signIn } from "next-auth/react"
 
export default function SignIn() {

  let {data : session} = useSession();


  return (
    <div>
     <button onClick={() => signIn("google")}>Login</button>
    </div>
  )
} 