import { connectDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Model";
import { verifySchema } from "@/schemas/verifySchema";
import { NextResponse } from "next/server";

export async function POST(req:Request){
      await connectDB()
      try {
           const {username,verifyCode} = await req.json()
            console.log(username,verifyCode)
           const result = verifySchema.safeParse({verifyCode})
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
                  message:"Username not found"
               },{status:400})
           }
           const iscodeValid = verifyCode === user.verifyCode
           const iscodeExpiry = new Date(user.verifyCodeExpiry) > new Date()
           if(!iscodeValid){
                  return NextResponse.json({
                        success:false,
                        message:"Invalid OTP"
                  },{status:400})
           }else if (!iscodeExpiry){
                 return NextResponse.json({
                        success:false,
                        message:"OTP expired"
                  },{status:400})
           }else if(iscodeValid && iscodeExpiry){
                  user.isVerified = true
                  await user.save()
                  return NextResponse.json({
                        success:true,
                        message:"Verifcation success now you can login"
                  },{status:200})
           }
      } catch (error) {
            console.log(error)
            return NextResponse.json({
                  success:false,
                  message:"Something went wrong"
            },{status:500})
      }
} 