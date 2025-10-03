"use client"
import MessageCard from '@/components/Card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/User.Model'
import { acceptingMessagesSchema } from '@/schemas/acceptingMessage'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Dashboard = () => {
  const [message,setMessages] = useState<Message[]>([])
  const [isloading,setIsLoading] = useState(false)
  const [isSwitching,setisSwitching] = useState(false)

  const handleDeleteMessage = (messageID:string)=>{
     setMessages(message.filter((msg)=>messageID !== msg._id))
  }

  const {data:session} = useSession()

  const form = useForm({
    resolver:zodResolver(acceptingMessagesSchema)
  })

  const {register,watch,setValue} = form
  const isAcceptingMessages = watch("isAcceptingMessages") 


  const fetchAcceptingMessage = useCallback(async()=>{
          setisSwitching(true)
        try{
           const response = await axios.get("/api/user/accept-message")
           if(response.data.success){
           setValue("isAcceptingMessages",response.data.isAcceptingMessages)
           }
        }catch(err){
            const axiosError = err as  AxiosError<ApiResponse> 
            toast.error(axiosError.response?.data?.message)
        }finally{
          setisSwitching(false)
        }
  },[setValue])


  const fetchMessages = useCallback(async(refresh:boolean= false)=>{
      setIsLoading(true)
      try {
        const response = await axios.get("/api/messages/get-messages")
        setMessages(response.data.messages || [])
        if(refresh){
          toast.success(response.data.message)
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        console.log(axiosError.response)
        toast.error(axiosError.response?.data?.message || "Something went wrong")
      }finally{
        setisSwitching(false)
        setIsLoading(false)
      }
  },[setIsLoading,setMessages])

  useEffect(()=>{
        if(!session || !session.user) return
        fetchAcceptingMessage()
        fetchMessages()
  },[session,setValue,fetchAcceptingMessage,fetchMessages])

  const handleSwitchChange = async()=>{
    try {
      const response =  await axios.post("/api/user/accept-message",{isAcceptingMessages:!isAcceptingMessages})
      setValue("isAcceptingMessages",!isAcceptingMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError?.response?.data.message || "Somethig went wrong")
    }
  }

   const {username} = session?.user  as User || ""
   const baseUrl = `${window.location.protocol}//${window.location.host}`
   const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () =>{
   navigator.clipboard.writeText(profileUrl)
   toast.success("URL copied")
  }
  if(!session || !session.user){
    return (
      <h1>Please log in </h1>
    )
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered  rounded w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('isAcceptingMessages')}
          checked={isAcceptingMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="ml-2">
          Accept Messages: {isAcceptingMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard