import mongoose, { Schema } from "mongoose"

// Type for the each block
type GridCell = {
  value: string
  playerId: string | null
}

// Type for 2D array
type Grid = {
  grid: GridCell[][]
}

const gridSchema: Schema = new Schema({
  grid: {
    type: [[{ value: String, playerId: String }]], // Each cell stores value and playerId
    required: true,
    default: function () {
      return Array.from({ length: 10 }, () =>
        Array(10).fill({ value: "", playerId: null })
      )
    },
  },
})

const Grid = mongoose.model<Grid>("Grid", gridSchema)
export default Grid
