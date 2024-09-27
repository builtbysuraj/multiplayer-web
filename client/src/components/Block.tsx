export type BlockType = {
  value: string
  playerId: string | null
}

type BlockProps = {
  block: BlockType
  onClick: () => void
  socketId: string
}

export const Block = ({ block, onClick, socketId }: BlockProps) => {
  const isFilledByOther = block.value !== "" && block.playerId !== socketId
  const isFilledByCurrent = block.playerId === socketId

  return (
    <div
      className={`w-12 h-12 border border-gray-400 flex items-center justify-center text-xl cursor-pointer truncate
        ${isFilledByOther ? "bg-gray-300 cursor-not-allowed" : ""} 
        ${isFilledByCurrent ? "bg-green-300" : ""}`}
      onClick={onClick}
    >
      {isFilledByCurrent ? block.value : isFilledByOther ? "" : ""}
    </div>
  )
}
