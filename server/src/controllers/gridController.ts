import Grid from "../models/gridModel"

// Initialize grid if not already in the database
export const initializeGrid = async () => {
  const gridCount = await Grid.countDocuments()
  if (gridCount === 0) {
    const initialGrid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ value: "", playerId: null }))
    )

    await Grid.create({ grid: initialGrid })
    console.log("Grid initialized in the database.")
  }
}

export const getGrid = async () => {
  try {
    const grid = await Grid.findOne()
    if (!grid) {
      throw new Error("Grid not found")
    }
    return grid.grid // Only return the grid (the 10x10 array)
  } catch (err) {
    console.error("Error fetching grid:", err)
    throw err
  }
}

export const updateBlock = async (
  position: { x: number; y: number },
  value: string,
  playerId: string
) => {
  try {
    const gridDoc = await Grid.findOne()
    if (!gridDoc) {
      throw new Error("Grid not found")
    }

    // Update the specific block at position x, y with value and playerId
    gridDoc.grid[position.x][position.y] = { value, playerId }
    await gridDoc.save()
    return { success: true }
  } catch (err) {
    console.error("Error updating grid:", err)
    return { success: false, error: err }
  }
}
