import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import Header from "./components/Header";
import MovesHistory from "./components/MovesHistory";
import GameActions from "./components/GameActions";
import "./App.css";

export default function App() {
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [version, setVersion] = useState("");
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [bestMove, setBestMove] = useState("");
  const [showBestMove, setShowBestMove] = useState(false);
  const [arrows, setArrows] = useState([]);
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

    // Aggiorna le frecce dopo la mossa del giocatore
    await updateArrows(playerMove.fen);

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
        // Aggiorna le frecce dopo la mossa dell'AI
        await updateArrows(aiMove.fen);
        // Aggiorna la mossa migliore dopo la mossa dell'AI
        await updateBestMove(aiMove.fen);
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
        // Aggiorna le frecce dopo la mossa manuale di Stockfish
        await updateArrows(response.fen);
        // Aggiorna la mossa migliore dopo la mossa manuale di Stockfish
        await updateBestMove(response.fen);
      }
    } catch (error) {
      console.error("Errore Stockfish:", error);
    }
  };

  // Funzione per reset del gioco
  const handleReset = async () => {
    if (window.api.chessApi?.resetGame) {
      const result = await window.api.chessApi.resetGame();
      setFen(result.fen);
      setHistory([]);
      // Aggiorna le frecce dopo il reset
      await updateArrows(result.fen);
      // Aggiorna la mossa migliore dopo il reset
      await updateBestMove(result.fen);
    } else {
      // Fallback se l'API non è disponibile
      setFen("start");
      setHistory([]);
      // Aggiorna le frecce dopo il reset
      await updateArrows("start");
      // Aggiorna la mossa migliore dopo il reset
      await updateBestMove("start");
    }
  };

  // Funzione per girare la scacchiera
  const handleFlipBoard = () => {
    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"));
  };

  // Funzione per aggiornare le frecce con le mosse migliori
  const updateArrows = async (currentFen) => {
    try {
      const multipleMoves =
        await window.api.stockfish.getMultipleMoves(currentFen);
      const newArrows = multipleMoves.map((move, index) => {
        return [move.slice(0, 2), move.slice(2, 4)];
      });
      setArrows(newArrows);
    } catch (error) {
      console.error("Errore nel recuperare le mosse multiple:", error);
      setArrows([]);
    }
  };

  // Funzione per aggiornare la mossa migliore
  const updateBestMove = async (currentFen) => {
    if (showBestMove) {
      try {
        const bestMoveStr = await window.api.stockfish.getBestMove(currentFen);
        setBestMove(bestMoveStr);
      } catch (error) {
        console.error("Errore nel recuperare la mossa migliore:", error);
      }
    }
  };

  // Funzione per mostrare/nascondere la mossa migliore
  const handleShowBestMove = async () => {
    if (showBestMove) {
      // Hide the best move indicator
      setShowBestMove(false);
      setBestMove("");
    } else {
      // Show the best move indicator
      try {
        const bestMoveStr = await window.api.stockfish.getBestMove(fen);
        setBestMove(bestMoveStr);
        setShowBestMove(true);
      } catch (error) {
        console.error("Errore nel recuperare la mossa migliore:", error);
      }
    }
  };

  return (
    <div className="app-container">
      <Header version={version} />
      <div className="main-content">
        <div className="left-panel">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardWidth={500}
            boardOrientation={boardOrientation}
            customArrows={arrows}
            areArrowsAllowed={true}
          />
        </div>
        <div className="right-panel">
          <div className="moves-indicator">
            <MovesHistory ref={movesRef} history={history} />
            {showBestMove && bestMove && (
              <div className="best-move-indicator">
                <strong>Best Move: {bestMove}</strong>
              </div>
            )}
          </div>
          <GameActions
            onReset={handleReset}
            onStockfishMove={handleStockfishMove}
            onFlipBoard={handleFlipBoard}
            onShowBestMove={handleShowBestMove}
          />
        </div>
      </div>
    </div>
  );
}
