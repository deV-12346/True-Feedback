import { Resend } from "resend";
export const resend = new Resend(process.env.RESND_API_KEY)
console.log(resend)