import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import { User } from "next-auth";
import { connectDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Model";
import { acceptingMessagesSchema } from "@/schemas/acceptingMessage";


export async function POST(req:Request){
      await connectDB()
      const session = await getServerSession(authOptions)
      console.log(session)
      const user: User = session?.user as User
      if(!session || !session.user){
            return NextResponse.json({
                  success:false,
                  message:"Not Authenticated"
            },{status:401})
      }
      const userId = user?.id
      try {
            const body = await req.json()
            const result = acceptingMessagesSchema.safeParse(body) 
            if(!result.success){
                  return NextResponse.json({
                        success:false,
                        message:result.error.issues[0].message
                  },{status:400})
            }
            const {isAcceptingMessages} = result.data
            const updatedUser = await UserModel.findByIdAndUpdate(
                  userId,
                  {isAcceptingMessages:isAcceptingMessages},
                  {new:true}
            )
            if(!updatedUser){
                  return NextResponse.json({
                        success:false,
                        message:"Failed to update Accepting Messages",
                  },{status:400})
            }
            return NextResponse.json({
                  success:true,
                  message:"Accepting Messages Status updated successfully",
                  user:updatedUser
            },{status:200})
      } catch (error) {
            console.log(error)
             return NextResponse.json({
                  success:false,
                  message:"Something went wrong"
            },{status:500})
      }
}
export async function GET(){
      await connectDB()
      const session = await getServerSession(authOptions)
      const user:User = session?.user as User
      if(!session || !session?.user){
            return NextResponse.json({
                  success:false,
                  message:"Not Authenticated"
            },{status:401})
      }
      const userId = user._id
      try {
            const foundUser = await UserModel.findById(userId)
            if(!foundUser){
                  return NextResponse.json({
                        success:false,
                        message:"User not found"
                  },{status:401})
            }
            return NextResponse.json({
                  sucess:true,
                  isAcceptingMessages:foundUser.isAcceptingMessages
            },{status:200})
      } catch (error) {
            console.log(error)
            return NextResponse.json({
                  success:false,
                  message:"Something went wrong while finding User messages status"
            },{status:400})
      }
}