import { Block } from "./Block"
import type { BlockType } from "./Block"

type GridProps = {
  grid: BlockType[][]
  handleBlockClick: (x: number, y: number) => void
  socketId: string | undefined
}

export const Grid = ({ grid, handleBlockClick, socketId }: GridProps) => {
  return (
    <div className="space-y-2">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {row.map((block, colIndex) => (
            <Block
              key={`${rowIndex}-${colIndex}`}
              block={block}
              onClick={() => handleBlockClick(rowIndex, colIndex)}
              socketId={socketId ?? ""}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
