import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/dbConnect"
import { UserModel } from "@/model/User.Model"

export const authOptions: NextAuthOptions = {
      providers: [
            CredentialsProvider({
                  id: "credentails",
                  name: "Credentails",
                  credentials: {
                        email: {type: "text",placeholder:"Username or Email"},
                        password: { type: "password",placeholder:"Password"}
                  },
                  async authorize(credentials: any): Promise<any> {
                        await connectDB()
                        try {
                              const user = await UserModel.findOne({
                                    $or: [
                                          { email: credentials.identifier },
                                          { username: credentials.identifier }
                                    ]
                              })
                              if (!user) {
                                    throw new Error("User not found")
                              }
                              if (!user.isVerified) {
                                    throw new Error("Please verify your account before login")
                              }
                              const isPassswordCorrect = await bcrypt.compare(credentials.password, user.password)
                              if (isPassswordCorrect) {
                                    return user
                              } else {
                                    throw new Error("Invalid Pasword")
                              }
                        }
                        catch (error: any) {
                              throw new Error(error || "Something went wrong")
                        }
                  }
            })
      ],
      callbacks: {
            async jwt({ token, user }) {
                  if (user) {
                        token._id = user._id?.toString()
                        token.isVerified = user.isVerified
                        token.isAcceptingMeassages = user.isAcceptingMessages
                        token.username = user.username
                  }
                  return token
            },
            async session({ session, token }) {
                  if (token) {
                        session.user._id = token._id
                        session.user.username = token.username
                        session.user.isAcceptingMessages = token.isAcceptingMessages
                        session.user.isVerified = token.isVerified
                  }
                  return session
            }
      },
      pages: {
            signIn: "/auth/sign-in"
      },
      session: {
            strategy: "jwt"
      },
      secret: process.env.SECRET_KEY
}