"use client"
import React from 'react'
import {
      Card,
      CardAction,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle,
} from "@/components/ui/card"
import { Message } from '@/model/User.Model'
import axios from "axios"
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'
type messageCardProps = {
      message: Message,
      handleDeleteMessage:(messageID:string)=>void
}
const MessageCard = ({message,handleDeleteMessage}:messageCardProps) => {
      const onMessageDeleteConfirm = async() =>{
            const res = axios.delete<ApiResponse>(`/api/message/delete-message/${message._id}`)
            toast.success(res.data?.message || "Message deleted")
            handleDeleteMessage(message._id)
      }
      return (
            <div>
            <Card>
                  <CardHeader>
                  {/* <CardTitle>Card Title</CardTitle> */}
                  <CardDescription>{message.content}</CardDescription>
                  <CardAction onClick={onMessageDeleteConfirm}></CardAction>
                  </CardHeader>
                  {/* <CardContent>
                  <p>{message.content}</p>
                  </CardContent> */}
                  <CardFooter>
                  <p>{new Date (message.createdAt).toLocaleString()}</p>
                  </CardFooter>
            </Card>
            </div>
      )
}

export default MessageCard