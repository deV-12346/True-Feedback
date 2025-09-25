import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
export const sendVerificationEmail = async(email:string,
      username:string,
      verifyCode:string):Promise<ApiResponse> =>{
      try{
          await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:"Mystery message verification code",
            react: VerificationEmail({username,otp:verifyCode})
          })
          return {
            success:true,
            message:"Verification Email Sent successfully"
          }
      }catch(err){
          console.log("Error while sending email",err)
          return {
            success:false,
            message:"Failed to send EMAIL"
          }
      }
}
 