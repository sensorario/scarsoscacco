import PropTypes from "prop-types";

export default function GameActions({ onReset, onStockfishMove, onFlipBoard }) {
  return (
    <div className="actions-container">
      <h3>Game Actions</h3>
      <button onClick={onReset} className="btn btn-primary">
        Reset
      </button>
      <button onClick={onStockfishMove} className="btn btn-success">
        Mossa Stockfish
      </button>
      <button onClick={onFlipBoard} className="btn btn-primary">
        Flip Board
      </button>
    </div>
  );
}

GameActions.propTypes = {
  onReset: PropTypes.func.isRequired,
  onStockfishMove: PropTypes.func.isRequired,
  onFlipBoard: PropTypes.func.isRequired,
};
