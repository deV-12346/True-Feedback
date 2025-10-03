import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import { User } from "next-auth";
import { connectDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Model";
import mongoose from "mongoose";

export async function GET(req:Request) {
      await connectDB()
      const session = await getServerSession(authOptions)
      const user:User = session?.user as User 
      if(!session || !session.user._id){
            return NextResponse.json({
                  success:false,
                  message:"Not Authenticated"
            },{status:400})
      }
      const userId = await new mongoose.Types.ObjectId(user._id)
      try {
            const userMessages = await UserModel.aggregate([
                  {$match:{_id:userId}},
                  {$unwind:"$messages"},
                  {$sort:{"messages.createdAt": -1}},
                  {$group:{_id:"$_id",messages:{$push:"$messages"}}}
            ])
            if(!userMessages || userMessages.length ===0){
                  return NextResponse.json({
                        success:false,
                        message:"No messages found"
                  },{status:404})
            }
            return NextResponse.json({
                  success:true,
                  messages:userMessages[0].messages
            },{status:200})
      } catch (error) {
            console.log(error)
            return NextResponse.json({
                  success:false,
                  message:"Something went wrong"
            },{status:500})
      }
}