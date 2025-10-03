"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from "zod"
const Signin = () => {
      const router = useRouter()
      const [isSubmitting,setSumitting] = useState(false)
      const form = useForm({
            resolver: zodResolver(signInSchema),
            defaultValues: {
                  identifier: "",
                  password: ""
            }
      })
      const onSubmit = async (data: z.infer<typeof signInSchema>) => {
            setSumitting(true)
            const res = await signIn("credentials", {
                  redirect: false,
                  identifier: data.identifier,
                  password: data.password
            })
            console.log(res)
            if (res?.error) {
                  toast.error(res.error)
            }
            setSumitting(false)
            if (res?.ok) {
                  toast.success("Log in success")
                  // redirect("/dashboard")
                  router.replace("/dashboard")
            }
      }
      return (
            <div className='min-h-screen flex justify-center items-center  bg-gray-50'>
            <div className='p-6 space-y-4 w-90  max-w-md rounded-2xl bg-white shadow-sm shadow-indigo-400'>
            <h1 className="text-4xl text-black font-extrabold text-center">Join Mystery Message</h1>
            <p className="text-[13px] text-cyan-600 font-medium text-center">Sign up to start your anonymous message</p>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                        <FormItem>
                              <FormLabel >Username or Email </FormLabel>
                              <FormControl>
                              <Input placeholder='Username or email' {...field} />
                              </FormControl>
                              <FormDescription />
                              <FormMessage />
                        </FormItem>
                  )}/>
            <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                  <FormItem>
                  <FormLabel >Password</FormLabel>
                  <FormControl>
                  <Input placeholder='Password' {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                  </FormItem>
                  )}
            />
            <div className='flex justify-center items-center mb-3'>
            <Button type='submit' className='w-40' disabled={isSubmitting} >
                { isSubmitting ? 
                <>
                <Loader2 className="animate-spin"/>Please wait
                </> :   
                "Sign In"}
            </Button>
            </div>
            </form>
            </Form>
             <div className="my-4 text-center">
              <p className="text-sm text-black font-bold">
                Already Registered ? {"   "}
                  <Link href="/sign-up" className="font-medium text-indigo-500 
                  text-sm">Sign up</Link>
              </p>
            </div>
      </div>
      </div>
      )
}

export default Signin
