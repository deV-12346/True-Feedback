import {z} from "zod"
const messagesSchea = z.object({
      context:z.string()
      .min(10,{message:"Message must be of  atleast 4 characters"})
      .max(100,{message:"Message must be no more than 100 characters"})
})