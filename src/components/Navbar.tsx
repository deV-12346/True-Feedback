"use client"
import { User } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const Navbar = () => {
  const {data:session} = useSession()
  const user:User = session?.user as User
  console.log(user)
  return (
    <div className='w-full flex flex-col sm:flex-row justify-between sm:justify-evenly gap-2 md:gap-0 items-center py-4 border-b-2  shadow-xl shadow-gray-300 '>
        <a href="#" className='font-extrabold text-xl text-black'>My Stery Message</a>
        <div className='flex justify-center items-center gap-3'>
        {
          session ?
          (
            <>
            <h1 className='text-[15px] font-medium'>Hello {user?.username || user.email}!</h1>
            <Button onClick={()=>signOut()}>Log Out</Button>
            </>
          )
          :
          (
            <Link href={"/sign-in"} className='cursor-pointer'>
            <Button>Log In</Button>
            </Link>
          )
        }
        </div>
    </div>
  )
}

export default Navbar