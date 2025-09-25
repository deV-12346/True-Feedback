import mongoose from "mongoose"

type connectionObject = {
      isConnected?:number
}
const connection : connectionObject = {}
export const connectDB = async():Promise<void> =>{
      if(connection.isConnected){
            console.log("MongoDB already connected")
            return 
      }
      try {
            const db = await mongoose.connect(`${process.env.MONGO_URI}`)
            connection.isConnected = db.connections[0].readyState
            console.log("MongoDB connected successfully")
      } catch (error) {
            console.log("Something went wrong while connecting DB",error)
            process.exit(1)
      }
}