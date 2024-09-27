import { Server } from "socket.io"
import { getGrid, updateBlock } from "./controllers/gridController"
import http from "http"
import { app } from "./server"

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
})

let onlineUsers = 0

io.on("connection", async (socket) => {
  onlineUsers++
  console.log(`A player connected: ${socket.id}. Online users: ${onlineUsers}`)

  try {
    // Fetch and send the current grid state to the connected player
    const grid = await getGrid()
    socket.emit("initGrid", { grid, onlineUsers })
  } catch (err) {
    console.error("Error fetching grid:", err)
    socket.emit("error", { message: "Unable to fetch grid" })
  }

  io.emit("updateOnlineUsers", onlineUsers)

  // Handle updates to the grid
  socket.on("updateBlock", async (data) => {
    const { position, value, playerId } = data
    try {
      const result = await updateBlock(position, value, playerId)
      if (result.success) {
        // Broadcast the grid update to all clients
        io.emit("gridUpdated", { position, value, playerId })
      } else {
        console.error("Failed to update block:", result.error)
        socket.emit("error", { message: "Failed to update block" })
      }
    } catch (err) {
      console.error("Error in updateBlock:", err)
      socket.emit("error", { message: "Unexpected error updating block" })
    }
  })

  // Handle player disconnect
  socket.on("disconnect", () => {
    // Decrement the onlineUsers count when a player disconnects
    onlineUsers = Math.max(0, onlineUsers - 1)
    console.log(`A player disconnected. Online users: ${onlineUsers}`)

    // Notify all clients about the updated online player count
    io.emit("updateOnlineUsers", onlineUsers)
  })
})

export default httpServer
