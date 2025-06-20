import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";

export default function App() {
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    console.log("API expose:", window.api);
  }, []);

  // Recupera la posizione iniziale (o corrente) al primo render
  useEffect(() => {
    if (window.api.chessApi?.getFen) {
      window.api.chessApi.getFen().then(setFen);
    }
  }, []);

  useEffect(() => {
    console.log("📜 Nuova history:", history);
  }, [history]);

  // Gestore del movimento dei pezzi
  const onDrop = async (from, to) => {
    // Mossa del giocatore
    const playerMove = await window.api.chessApi.makeMove({
      from,
      to,
      promotion: "q",
    });

    if (playerMove.error) {
      console.warn("Mossa illegale:", playerMove.error);
      return false;
    }

    setFen(playerMove.fen);
    setHistory(await window.api.chessApi.getHistory());

    // Mossa automatica di Stockfish
    try {
      const bestMove = await window.api.stockfish.getBestMove(playerMove.fen);

      const aiMove = await window.api.chessApi.makeMove({
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        promotion: "q",
      });

      if (!aiMove.error) {
        setFen(aiMove.fen);
        setHistory(await window.api.chessApi.getHistory());
      }
    } catch (error) {
      console.error("Errore Stockfish:", error);
    }

    return true;
  };

  // Funzione per mossa manuale di Stockfish
  const handleStockfishMove = async () => {
    try {
      const bestMove = await window.api.stockfish.getBestMove(fen);

      const response = await window.api.chessApi.makeMove({
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        promotion: "q",
      });

      if (!response.error) {
        setFen(response.fen);
        setHistory(await window.api.chessApi.getHistory());
      }
    } catch (error) {
      console.error("Errore Stockfish:", error);
    }
  };

  return (
    <div
      style={{
        marginLeft: 30,
        marginTop: 30,
        display: "flex",
        flexDirection: "row",
        gap: 30,
      }}
    >
      <div className="left">
        <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
      </div>
      <div
        className="right"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 30,
        }}
      >
        <div className="moves">
          {history
            .reduce((pairs, move, index) => {
              if (index % 2 === 0) {
                pairs.push([move]);
              } else {
                pairs[pairs.length - 1].push(move);
              }
              return pairs;
            }, [])
            .map((pair, index) => (
              <div key={`move-${index + 1}`}>
                {`${index + 1}. ${pair[0]}${pair[1] ? ` ${pair[1]}` : ""}`}
              </div>
            ))}
        </div>
        <div className="actions">
          <button
            onClick={async () => {
              if (window.api.chessApi?.resetGame) {
                const result = await window.api.chessApi.resetGame();
                setFen(result.fen);
                setHistory([]);
              } else {
                // Fallback se l'API non è disponibile
                setFen("start");
                setHistory([]);
              }
            }}
          >
            Reset
          </button>

          <button onClick={handleStockfishMove}>Mossa Stockfish</button>
        </div>
      </div>
    </div>
  );
}
