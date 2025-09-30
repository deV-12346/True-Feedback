"use client"
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from "axios"
import z from "zod"
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
const Verify=() => {
      const router = useRouter()
      const params = useParams<{username:string}>()
      const [isVerifyingOTP,setOTPverifying] = useState(false)
      const form = useForm({
            resolver:zodResolver(verifySchema),
            defaultValues:{
                  verifyCode:""
            }
      })
      const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
            setOTPverifying(true)
      try {
            const response = await axios.post("/api/user/verify-email",{username:params.username,verifyCode:data.verifyCode})
            if(response.data.success){
               toast.success(response.data.message)
               setTimeout(()=>{
                 router.push("/sign-in")
               },3000)
            }
      } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data?.message)
      }finally{
            setOTPverifying(false)
      }
      }
  return (
    <div className='w-full h-screen flex justify-around items-center'>
      <div className='w-80 px-5 py-10 h-auto bg-gray-50 rounded-2xl shadow-sm shadow-indigo-400 '>
          <h1 className='text-3xl py-2 text-black font-extrabold text-center'>Verify your email</h1>
          {params.username && <p className='text-center text-lg py-2 text-indigo-500 font-medium'>
            OTP sent on registered email</p> }
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
            control={form.control}
            name="verifyCode"
            render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter OTP" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
             )}
             />
            <div className='flex justify-center items-center'>
            <Button className='w-40'>
            { isVerifyingOTP ? 
            <><Loader className='animate-spin'/> Please wait</>
            :
            "Verify OTP"
            }
            </Button>
          </div>
            </form>
          </Form>
      </div>

    </div>
  )
}

export default Verify