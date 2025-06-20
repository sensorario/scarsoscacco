import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";

export default function App() {
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);

  // Recupera la posizione iniziale (o corrente) al primo render
  useEffect(() => {
    if (window.chessApi?.getFen) {
      window.chessApi.getFen().then(setFen);
    }
  }, []);

  useEffect(() => {
    console.log("📜 Nuova history:", history);
  }, [history]);

  // Gestore del movimento dei pezzi
  const onDrop = async (sourceSquare, targetSquare) => {
    // if (!window.chessApi?.makeMove) return false;

    const response = await window.chessApi.makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // promozione automatica a donna
    });

    if (response.error) {
      console.warn("Mossa illegale:", response.error);
      return false;
    }

    setFen(response.fen); // aggiorna la posizione
    const newHistory = await window.chessApi.getHistory(); // 👈
    setHistory([...newHistory]);

    return true;
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
              if (window.chessApi?.resetGame) {
                const result = await window.chessApi.resetGame();
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
        </div>
      </div>
    </div>
  );
}
