import { connectDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Model";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";
import z from "zod";

const usernameQuerySchema = z.object({
      username:usernameValidation
})
export async function GET(req:Request){
      await connectDB()
      try {
           const {searchParams} = new URL(req.url)
           const queryParams = {
            username : searchParams.get("username")
           } 
           const result = usernameQuerySchema.safeParse(queryParams)

           if(!result.success){
            const usernameError = result.error.issues[0].message || []
            console.log(usernameError)
               return NextResponse.json({
                  success:false,
                  message:usernameError
               },{status:400})
           }
           const {username} = result.data
           const findUsername = await UserModel.findOne({
                username:username,isVerified:true
           })
           if(findUsername){
            return NextResponse.json({
                  success:false,
                  message:"Username already taken"
            },{status:400})
           } 
           return NextResponse.json({
                  success:true,
                  message:"Username is available"
           },{status:200})
      } catch (error) {
           console.log(error)
           return NextResponse.json({
            success:false,
            message:"Error chekcing Username"
           },{status:500}) 
      }
}