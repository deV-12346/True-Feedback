"use client"
import {Loader, Loader2} from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { signUpSchema } from "@/schemas/signupSchema"
import { useDebounce } from "@/hooks/useDebounce"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
const Signup = () => {
  const [username, setUsername] = useState("")
  const [usernameMeassge, setUsernameMessage] = useState("")
  const [isCheckingUsername, setCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounceUsername = useDebounce(username, 1500);
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })
  useEffect(() => {
    const checkUsername = async () => {
      setCheckingUsername(true)
      try {
        const response = await axios.get(`/api/user/check-username-unique?username=${debounceUsername}`)
        if (response.data.success) {
          setUsernameMessage(response.data.message)
          router.push(`/verify/${username}`)
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data?.message || "Something went wrong")
      } finally {
        setCheckingUsername(false)
      }
    }
    if(debounceUsername.length > 3){
       checkUsername()
    }
  }, [debounceUsername])
  const onSubmit = async(data : z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true)
      try {
        const response = await axios.post("/api/user/sign-up",data)
        if(response.data.success){
          toast.success(response.data.message)
        router.push(`/verify/${username}`)
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data?.message || "Something went wrong")
      } finally {
        setIsSubmitting(false)
      }
  }
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50">
      <div className="w-90 h-auto  py-4 px-4 rounded-xl shadow-xs shadow-indigo-300 bg-white">
      <h1 className="text-4xl text-black font-extrabold text-center">Join Mystery Message</h1>
      <p className="my-3 text-[13px] text-cyan-600 font-medium text-center">Sign up to start your anonymous message</p>
      <Form {...form}> 
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Username" {...field} onChange={(e)=>{field.onChange(e)
                setUsername(e.target.value)
                }} />
            </FormControl>
          {  isCheckingUsername ? (<Loader className="animate-spin"/>)
            :
          (  usernameMeassge 
            && 
            <p className={`text=[15px] font-medium ${usernameMeassge === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
              {" "}{usernameMeassge}
            </p>
          )
          }
          </FormItem>
           )}
           />
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
           )}
           />

           <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input placeholder="Password" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
           )}
           />
          <div className="flex justify-center items-center">
            <Button type="submit" disabled={isSubmitting} className="w-50">
           {isSubmitting? 
           <>
           <Loader2 className="animate-spin"/> Please wait
           </>
            : "Sign Up"} 
          </Button>
          </div>
        </form>
      </Form>
      <div className="my-4 text-center">
        <p className="text-sm text-black font-bold">
          Already Registered ? {"   "}
            <Link href="/sign-in" className="font-medium text-indigo-500 
            text-sm">Sign in</Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default Signup