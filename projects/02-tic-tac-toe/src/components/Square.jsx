export const Square = ({ children, isSelected, updateBoard, index }) => {
  const classname = `square ${isSelected ? 'is-selected' : ''}`

  const handleCLick = () => {
    updateBoard(index)
  }
  return (
    <div onClick={handleCLick} className={classname}>
      {children}
    </div>
  )
}