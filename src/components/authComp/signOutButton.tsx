"use client"
import { useSession,signOut } from "next-auth/react"
 
export default function SignOut() {

  let {data : session} = useSession();


  return (
    <div>
      {session ? <button onClick={() => signOut()} className=" ring-1 hover:bg-gray-900 ring-white px-4 py-2 rounded-2xl text-white">Logout</button> : <p>Not signed in</p>}
    </div>
  )
} 