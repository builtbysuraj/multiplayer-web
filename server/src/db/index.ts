import mongoose from "mongoose"
import { DB_NAME, ENV } from "../constants"

const connectDB = async () => {
  try {
    await mongoose.connect(`${ENV.MONGODB_URL}/${DB_NAME}`)
    console.log("MongoDB connected")
  } catch (error) {
    console.log("MongoDB connection FAILED ", error)
  }
}

export default connectDB
