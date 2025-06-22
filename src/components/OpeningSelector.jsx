import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { chessOpenings, getOpeningOptions } from "../data/chessOpenings";

export default function OpeningSelector({ onOpeningSelect, currentOpening }) {
  const [selectedOpening, setSelectedOpening] = useState(
    currentOpening || "starting_position",
  );

  // Sync with parent component's opening state
  useEffect(() => {
    setSelectedOpening(currentOpening || "starting_position");
  }, [currentOpening]);

  const handleOpeningChange = (event) => {
    const openingId = event.target.value;
    setSelectedOpening(openingId);

    // Find the full opening object and pass it to the parent
    const opening = chessOpenings.find((op) => op.id === openingId);
    if (opening && onOpeningSelect) {
      onOpeningSelect(opening);
    }
  };

  const openingOptions = getOpeningOptions();

  return (
    <div className="opening-selector">
      <h4>Chess Openings</h4>
      <div className="select-container">
        <select
          value={selectedOpening}
          onChange={handleOpeningChange}
          className="opening-select"
        >
          {openingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {selectedOpening !== "starting_position" && (
        <div className="opening-info">
          <p className="opening-description">
            {chessOpenings.find((op) => op.id === selectedOpening)?.description}
          </p>
          <p className="opening-moves">
            <strong>Moves:</strong>{" "}
            {chessOpenings
              .find((op) => op.id === selectedOpening)
              ?.moves.join(" ")}
          </p>
        </div>
      )}
    </div>
  );
}

OpeningSelector.propTypes = {
  onOpeningSelect: PropTypes.func.isRequired,
  currentOpening: PropTypes.string,
};
