import { Square } from "./Square.jsx"
export function WinnerModal({winner, resetGame}) {
  if (winner === null) return null

  const winnrtText = winner === false ? 'Empate' : 'Ganó: '
  return (

    <section className="winner">
      <div className="text">
        <h2>{winnrtText}</h2>

        <header className="win">
          {winner && <Square>{winner}</Square>}
        </header>

        <footer>
          <button onClick={resetGame}>Empezar de nuevo</button>
        </footer>
      </div>
    </section>
  )
}