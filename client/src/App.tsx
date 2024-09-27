import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Grid } from "./components/Grid"

const socket = io("http://localhost:3000")

function App() {
  const [grid, setGrid] = useState(
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ value: "", playerId: null }))
    )
  )

  const [onlineUsers, setOnlineUsers] = useState(0)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [timer, setTimer] = useState(0) // Store remaining time of the restriction

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server")
    })

    // Listen for the initial grid and number of online users
    socket.on("initGrid", ({ grid, onlineUsers }) => {
      setGrid(grid) // Set the grid received from the server
      setOnlineUsers(onlineUsers)
    })

    socket.on("gridUpdated", ({ position, value, playerId }) => {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid]
        if (newGrid[position.x] && newGrid[position.x][position.y]) {
          newGrid[position.x][position.y] = { value, playerId } // Store both the value and the player ID
        }
        return newGrid
      })
    })

    // Listen for updates on the number of online users
    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users)
    })

    // Listen for the cleared grid from the server
    socket.on("gridCleared", (clearedGrid) => {
      setGrid(clearedGrid) // Set the cleared grid
    })

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect()
    }
  }, [])

  const startTimer = () => {
    setHasSubmitted(true)
    setTimer(60) // Set a 60-second timer

    // Decrease the timer every second
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown) // Clear the timer when it hits 0
          setHasSubmitted(false) // Allow the user to submit again
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)
  }

  const handleBlockClick = (x: number, y: number) => {
    // Ensure the grid exists and grid[x][y] is defined
    if (hasSubmitted || !grid[x] || !grid[x][y] || grid[x][y].value !== "") {
      console.log("Block already filled or submission locked")
      return
    }

    const value = prompt("Enter a single Unicode character:")

    // Check if the input is exactly one character
    if (!value || value.length !== 1) {
      alert("Please enter exactly one character.")
      return
    }

    // Emit the block update with the player's ID
    socket.emit("updateBlock", {
      position: { x, y },
      value,
      playerId: socket.id,
    })
    startTimer() // Start the 1-minute restriction
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Online Players: {onlineUsers}</h1>
      <div className="mb-4">
        {hasSubmitted ? (
          <p className="text-red-600">
            You can submit again in {timer} seconds.
          </p>
        ) : (
          <p className="text-green-600">You can submit a block now.</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="space-y-2">
          <Grid
            grid={grid}
            handleBlockClick={handleBlockClick}
            socketId={socket.id}
          />
        </div>
      </div>
    </div>
  )
}

export default App
