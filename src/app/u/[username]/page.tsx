"use client"
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage,Form } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { messagesSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from "zod"

const Page = () => {
  const {username} =useParams<{username:string}>()
  const form = useForm({
    resolver:zodResolver(messagesSchema),
    defaultValues:{
      content:""
    }
  })
  console.log(username)
  const [loading,setLoading] = useState(false)
  const onsubmit = async(data:z.infer<typeof messagesSchema>) =>{
         setLoading(true)
        try {
          const response = await axios.post<ApiResponse>("/api/messages/sent-messages",{username,content:data.content})
          if(response.data.success){
            toast.success(response.data.message)
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast.error(axiosError?.response?.data.message || "Something went wrong")
        }
        finally{
          setLoading(false)
        }
  }
  return (
    <div className='w-full h-screen bg-gray-50 flex justify-center items-center '>
       <div className='flex flex-col justify-between items-center max-w-md '>
        <h1 className='text-center text-2xl md:text-4xl font-extrabold my-3'>Public Profile Link</h1>
        <p className='text-xl text-red-600 text-center mb-3'>Send Anonmyous message to {username}</p>
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onsubmit)} className='space-y-6 w-full'>
          <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea placeholder="Type message here" {...field} className='w-full'/>
            </FormControl>
            <FormMessage/>
          </FormItem>
           )}
           />
           <div className="flex justify-center items-center">
            
              <Button type="submit" className="w-50">{ loading ? <><Loader2 className="animate-spin"/>Sending</>:"Send Message"}</Button>
           </div>
          </form>
       </Form>
       </div>
    </div>
  )
}

export default Page