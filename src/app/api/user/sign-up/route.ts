import { sendVerificationEmail } from "@/helpers/sentVerificationEmail";
import { connectDB } from "@/lib/dbConnect";
import { UserModel } from "@/model/User.Model";
import { signUpSchema } from "@/schemas/signupSchema";
import bcrypt from "bcryptjs";

export async function POST(req:Request)  {
      await connectDB()
      try {
            const body = await req.json()
            const result = signUpSchema.safeParse(body)

            if(!result.success){
                  return Response.json({
                        success:false,
                        message:result.error.issues[0].message
                  },{status:400})
            }

            const {username,email,password} = body
            const existingUserName = await UserModel.findOne({
                  username:username,
                  isVerified:true
            })

            if(existingUserName){
                  return Response.json({
                        success:false,
                        message:"Username is already taken"
                  },{status:400})
            }
            const existingUser = await UserModel.findOne({
                  email:email
            })
            const otp = Math.floor(100000+Math.random()*90000).toString()
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            if(existingUser){
                  if(existingUser.isVerified){
                        return Response.json({
                              success:false,
                              message:"User already exists"
                        },{status:400})
                  }else{
                       const hashedPassword = await bcrypt.hash(password,10)  //agr naya username dal de 
                       existingUser.password = hashedPassword
                       existingUser.verifyCode = otp
                       existingUser.verifyCodeExpiry = expiryDate
                       await existingUser.save()
                  }
            }else{
                  const hashedPassword = await bcrypt.hash(password,10)
                  const newUser = new UserModel({
                        username,
                        email,
                        password:hashedPassword,
                        verifyCode:otp,
                        verifyCodeExpiry:expiryDate,
                        messages:[]
                  })
                  await newUser.save()
            }
            //send verification email
            const emailResponse = await sendVerificationEmail(
                  email,
                  username,
                  otp
            )
            if(!emailResponse.success){
                  return Response.json({
                        success:false,
                        message:emailResponse.message
                  },{status:500})
            }
            return Response.json({
                  success:true,
                  message:"User registered successfully please verify your email"
            },{status:201})
      } catch (error) {
            console.log("Error while registering",error)
            return Response.json({
                  success:false,
                  message:"Something went wrong"
            },{status:500})
      }
}