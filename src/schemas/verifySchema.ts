import {z} from "zod"
import { usernameValidation } from "./signupSchema"
export const verifySchema  = z.object({
      username:usernameValidation,
      verifyCode:z.string().length(6,"Verification code must be of 6 digits")
})