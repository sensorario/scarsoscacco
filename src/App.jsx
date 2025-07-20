import { useEffect, useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import Header from "./components/Header";
import MovesHistory from "./components/MovesHistory";
import GameActions from "./components/GameActions";
import TabView from "./components/TabView/TabView";
import Notes from "./components/Notes";
import "./App.css";
import OpeningSelector from "./components/OpeningSelector";

export default function App() {
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [version, setVersion] = useState("");
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [bestMove, setBestMove] = useState("");
  const [showBestMove, setShowBestMove] = useState(false);
  const [arrows, setArrows] = useState([]);
  const [autoMove, setAutoMove] = useState(true);
  const [currentOpening, setCurrentOpening] = useState(null);
  const [fenMessages, setFenMessages] = useState([]);
  const movesRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formattedFenMessages, setFormattedFenMessages] = useState([]);

  const loadNotesHandler = () => {
    const searchValue = /%20/g;
    const replaceValue = "+";
    const rightFen = encodeURIComponent(fen).replace(searchValue, replaceValue);
    const url = "https://simonegentili.com/api/chess/fen/" + rightFen;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fen, currentUser }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFenMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  useEffect(loadNotesHandler, [fen, currentUser]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      window.api.electronAPI.invoke("get-authenticated-user").then((user) => {
        if (user) {
          console.log("Utente attuale:", user);
          setCurrentUser(user);
          clearInterval(interval); // Stop retrying once the user is not null
        }
      });
    }, 1000); // Retry every 1 second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

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

    // Mossa automatica di Stockfish (solo se autoMove è abilitato)
    if (autoMove) {
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
      setCurrentOpening(null);
      // Aggiorna le frecce dopo il reset
      await updateArrows(result.fen);
      // Aggiorna la mossa migliore dopo il reset
      await updateBestMove(result.fen);
    } else {
      // Fallback se l'API non è disponibile
      setFen("start");
      setHistory([]);
      setCurrentOpening(null);
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
        const colorMap = ["#FF0000", "#00FF00", "#0000FF"];
        const color = colorMap[index % colorMap.length];
        return [move.slice(0, 2), move.slice(2, 4), color];
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

  // Funzione per attivare/disattivare la mossa automatica
  const handleToggleAutoMove = () => {
    setAutoMove((prev) => !prev);
  };

  // Funzione per gestire la selezione di un'apertura
  const handleOpeningSelect = async (opening) => {
    try {
      setCurrentOpening(opening);

      if (opening.moves && opening.moves.length > 0) {
        const result = await window.api.chessApi.setOpeningPosition(
          opening.moves,
        );

        if (result.error) {
          console.error("Error setting opening position:", result.error);
          return;
        }

        setFen(result.fen);
        setHistory(result.history || []);

        // Update arrows and best move for the new position
        await updateArrows(result.fen);
        await updateBestMove(result.fen);
      } else {
        // Starting position
        handleReset();
      }
    } catch (error) {
      console.error("Error selecting opening:", error);
    }
  };

  useEffect(() => {
    const numericKeyValues = Object.keys(fenMessages)
      .filter((key) => !isNaN(Number(key)))
      .map((key) => fenMessages[key]);
    console.log(JSON.stringify(numericKeyValues));
    setFormattedFenMessages(numericKeyValues);
  }, [fenMessages]);

  const tabs = [
    {
      label: "SCACCHIERA",
      content: (
        <div className="la-scacchiera" style={{ display: "flex", gap: "1rem" }}>
          <div className="chessboard">
            {showBestMove && (
              <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                boardWidth={500}
                boardOrientation={boardOrientation}
                customArrows={arrows}
              />
            )}
            {!showBestMove && (
              <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                boardWidth={500}
                boardOrientation={boardOrientation}
              />
            )}
          </div>
          <div className="history-panel">
            <MovesHistory ref={movesRef} history={history} />
          </div>
          <div className="notes">
            <button onClick={handleReset} className="btn btn-primary">
              Reset
            </button>
            {currentUser && (
              <Notes
                fen={fen}
                currentUser={currentUser}
                formattedFenMessages={formattedFenMessages}
                loadNotesHandler={loadNotesHandler}
              />
            )}
          </div>
        </div>
      ),
    },
    {
      label: "CONFIG",
      content: (
        <div className="game-actions">
          <GameActions
            onStockfishMove={handleStockfishMove}
            onFlipBoard={handleFlipBoard}
            onShowBestMove={handleShowBestMove}
            onToggleAutoMove={handleToggleAutoMove}
            autoMove={autoMove}
            showBestMove={showBestMove}
            bestMove={bestMove}
          />
        </div>
      ),
    },
  ];

  if (currentUser) {
    tabs.push({
      label: "OPENINGS",
      content: (
        <div>
          <OpeningSelector
            onOpeningSelect={handleOpeningSelect}
            currentOpening={currentOpening?.id}
          />
        </div>
      ),
    });
  }

  return (
    <div className="app-container">
      <Header version={version} currentUser={currentUser} />
      <TabView tabs={tabs} />
    </div>
  );
}
