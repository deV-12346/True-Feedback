import {z} from "zod"
export const usernameValidation = z.string()
      .min(4,"Username must be atleast 5 characters")
      .max(10,"Username must be no more than 10 characters")
      .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const signUpSchema  = z.object({
      username:usernameValidation,
      email:z.string().email({message:"Enter a valid email"}),
      password:z.string().min(6,"Password must of 6 character")
      .max(10,"Password must no more than 10 characters")
})