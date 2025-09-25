import { Message } from "@/model/User.Model";

export interface ApiResponse{
      success:boolean,
      message:string,
      isAcceptingMessages?:boolean,
      messages?:Array<Message>
}