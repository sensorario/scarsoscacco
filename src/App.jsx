import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";

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
    <div style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}>
      <header
        style={{
          padding: "15px 30px",
          backgroundColor: "#0077B5",
          borderBottom: "1px solid #005885",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 119, 181, 0.2)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            color: "white",
            fontWeight: "600",
            letterSpacing: "-0.5px",
          }}
        >
          Scarso Scacco
        </h1>
        <span
          style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: "500",
          }}
        >
          v{version}
        </span>
      </header>
      <div
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "row",
          gap: 30,
          backgroundColor: "#f8f9fa",
          minHeight: "calc(100vh - 70px)",
          padding: "20px 0",
          justifyContent: "space-around",
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
          <div
            ref={movesRef}
            className="moves"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              maxHeight: "400px",
              overflowY: "auto",
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#0077B5",
                fontSize: "16px",
                fontWeight: "600",
                flexShrink: 0,
              }}
            >
              Storia Mosse
            </h3>
            <div style={{ flex: 1 }}></div>
            <div>
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
                  <div
                    key={`move-${index + 1}`}
                    style={{
                      padding: "4px 0",
                      fontSize: "14px",
                      color: "#333",
                      fontFamily: "'Monaco', 'Consolas', monospace",
                    }}
                  >
                    {`${index + 1}. ${pair[0]}${pair[1] ? ` ${pair[1]}` : ""}`}
                  </div>
                ))}
            </div>
          </div>
          <div
            className="actions"
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
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
              style={{
                backgroundColor: "#0077B5",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#005885")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#0077B5")}
            >
              Reset
            </button>

            <button
              onClick={handleStockfishMove}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              Mossa Stockfish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
