import { forwardRef } from "react";
import PropTypes from "prop-types";

const MovesHistory = forwardRef(function MovesHistory({ history }, ref) {
  return (
    <div ref={ref} className="moves-container">
      <h3 className="moves-title">History Moves</h3>
      <div className="moves-spacer"></div>
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
            <div key={`move-${index + 1}`} className="move-item">
              {`${index + 1}. ${pair[0]}${pair[1] ? ` ${pair[1]}` : ""}`}
            </div>
          ))}
      </div>
    </div>
  );
});

MovesHistory.propTypes = {
  history: PropTypes.array.isRequired,
};

export default MovesHistory;
