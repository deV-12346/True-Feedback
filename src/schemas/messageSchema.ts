import {z} from "zod"
export const messagesSchema = z.object({
      content:z.string()
      .min(10,{message:"Message must be of atleast 10 characters"})
      .max(100,{message:"Message must be no more than 100 characters"})
})