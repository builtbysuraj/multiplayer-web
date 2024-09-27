import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Grid } from "./components/Grid"

const socket = io(import.meta.env.VITE_SERVER_URL)

function App() {
  const [grid, setGrid] = useState(
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ value: "", playerId: null }))
    )
  )

  const [onlineUsers, setOnlineUsers] = useState(0)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server")
    })

    socket.on("initGrid", ({ grid, onlineUsers }) => {
      setGrid(grid)
      setOnlineUsers(onlineUsers)
    })

    socket.on("gridUpdated", ({ position, value, playerId }) => {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid]
        if (newGrid[position.x] && newGrid[position.x][position.y]) {
          newGrid[position.x][position.y] = { value, playerId }
        }
        return newGrid
      })
    })

    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users)
    })

    socket.on("gridCleared", (clearedGrid) => {
      setGrid(clearedGrid)
    })

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
