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
      }}
    >
      <div className="board">
        <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
      </div>
      <div className="moves">
        {history.map((move) => (
          <div key={move.id}>{move}</div>
        ))}
      </div>
    </div>
  );
}
