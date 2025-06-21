import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import Header from "./components/Header";
import MovesHistory from "./components/MovesHistory";
import "./App.css";

export default function App() {
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [version, setVersion] = useState("");
  const movesRef = useRef(null);

  useEffect(() => {
    console.log("API expose:", window.api);
  }, []);

  // Recupera la posizione iniziale (o corrente) al primo render
  useEffect(() => {
    if (window.api.chessApi?.getFen) {
      window.api.chessApi.getFen().then(setFen);
    }
    if (window.api.chessApi?.getVersion) {
      window.api.chessApi.getVersion().then(setVersion);
    }
  }, []);

  useEffect(() => {
    console.log("📜 Nuova history:", history);
    // Auto-scroll verso il basso quando vengono aggiunte nuove mosse
    if (movesRef.current) {
      movesRef.current.scrollTop = movesRef.current.scrollHeight;
    }
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
    <div className="app-container">
      <Header version={version} />
      <div className="main-content">
        <div className="left-panel">
          <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
        </div>
        <div className="right-panel">
          <MovesHistory ref={movesRef} history={history} />
          <div className="actions-container">
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
              className="btn btn-primary"
            >
              Reset
            </button>

            <button onClick={handleStockfishMove} className="btn btn-success">
              Mossa Stockfish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
