import { connectDB } from "@/lib/dbConnect";
import { Message, UserModel } from "@/model/User.Model";
import { messagesSchema } from "@/schemas/messageSchema";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
      await connectDB()
      try {
            const {username,content} = await req.json()
            const result = messagesSchema.safeParse({content})
            if(!result.success){
                  return NextResponse.json({
                  success:false,
                  message:result.error.issues[0].message    
                  },{status:400})
            }
            const user = await UserModel.findOne({username:username})
            if(!user){
                  return NextResponse.json({
                        success:false,
                        message:"User not found"
                  },{status:404})
            }
            if(!user.isAcceptingMessages){
                  return NextResponse.json({
                        success:false,
                        message:"User is  not accepting the messages"
                  },{status:403})
            }
            const newMessage = {content,createdAt:new Date()}
            user.messages.push(newMessage as Message)
            await user.save()
            return NextResponse.json({
                  success:true,
                  message:"Message sent"
            },{status:201})
      } catch (error) {
            console.log(error)
            return NextResponse.json({
                  success:false,
                  message:"Something went wrong"
            },{status:500})
      }
}