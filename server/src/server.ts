import express from "express"
import connectDB from "./db"
import cors from "cors"
import { initializeGrid } from "./controllers/gridController"
import httpServer from "./socket"

export const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

connectDB()
  .then(async () => {
    await initializeGrid()

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
    })
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err)
  })
