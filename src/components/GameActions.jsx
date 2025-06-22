import PropTypes from "prop-types";

export default function GameActions({
  onReset,
  onStockfishMove,
  onFlipBoard,
  onShowBestMove,
  onToggleAutoMove,
  autoMove,
  showBestMove,
}) {
  return (
    <div className="actions-container">
      <h3>Game Actions</h3>
      <button onClick={onReset} className="btn btn-primary">
        Reset
      </button>
      <button onClick={onStockfishMove} className="btn btn-primary">
        Mossa Stockfish
      </button>
      <button onClick={onFlipBoard} className="btn btn-primary">
        Flip Board
      </button>
      <button
        onClick={onShowBestMove}
        className={`btn ${showBestMove ? "btn-success" : "btn-secondary"}`}
      >
        Show Best Move {showBestMove ? "ON" : "OFF"}
      </button>
      <button
        onClick={onToggleAutoMove}
        className={`btn ${autoMove ? "btn-success" : "btn-secondary"}`}
      >
        {autoMove ? "Auto Move ON" : "Auto Move OFF"}
      </button>
    </div>
  );
}

GameActions.propTypes = {
  onReset: PropTypes.func.isRequired,
  onStockfishMove: PropTypes.func.isRequired,
  onFlipBoard: PropTypes.func.isRequired,
  onShowBestMove: PropTypes.func.isRequired,
  onToggleAutoMove: PropTypes.func.isRequired,
  autoMove: PropTypes.bool.isRequired,
  showBestMove: PropTypes.bool.isRequired,
};
