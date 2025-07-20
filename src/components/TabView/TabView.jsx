import React from "react";
import { chessOpenings, getOpeningOptions } from "../../data/chessOpenings";

export default function TabView({ tabs }) {
  // Always show the first tab's content (SCACCHIERA)
  const selectedTab = 0;

  return (
    <div className="tab-container">
      <div
        className="tab-view"
        style={{
          marginTop: "5px",
          marginBottom: "15px",
          paddingTop: "12px",
          paddingLeft: "10px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {tabs[selectedTab]?.toggleButtons && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {tabs[selectedTab].toggleButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: button.active ? "#007bff" : "#f8f9fa",
                  color: button.active ? "white" : "#333",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}

        {tabs[selectedTab]?.openingSelector && (
          <div
            style={{
              marginLeft: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Opening:
            </label>
            <select
              value={
                tabs[selectedTab].openingSelector.currentOpening ||
                "starting_position"
              }
              onChange={(e) => {
                const openingId = e.target.value;
                const opening = chessOpenings.find((op) => op.id === openingId);
                if (
                  opening &&
                  tabs[selectedTab].openingSelector.onOpeningSelect
                ) {
                  tabs[selectedTab].openingSelector.onOpeningSelect(opening);
                }
              }}
              style={{
                padding: "6px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "#fff",
                cursor: "pointer",
                minWidth: "200px",
              }}
            >
              {getOpeningOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {tabs[selectedTab]?.bestMove && (
          <div
            style={{
              marginLeft: "20px",
              padding: "8px 12px",
              backgroundColor: "#e7f3ff",
              border: "1px solid #007bff",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            Best Move: {tabs[selectedTab].bestMove}
          </div>
        )}
      </div>

      <div
        className="tab-content"
        style={{
          padding: "10px",
          borderTop: "2px solid rgb(204, 204, 204)",
        }}
      >
        {tabs[selectedTab].content}
      </div>
    </div>
  );
}
