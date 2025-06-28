import { useState } from "react";

export default function TabView({ tabs }) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="tab-container">
      <div
        className="tab-view"
        style={{
          marginTop: "5px",
          paddingTop: "12px",
          paddingLeft: "10px",
          display: "flex",
          gap: "10px",
        }}
      >
        {tabs.map((tab, index) => {
          return (
            <div
              key={index}
              onClick={() => setSelectedTab(index)}
              style={{
                padding: "10px",
                borderTop: "2px solid rgb(204, 204, 204)",
                borderLeft: "2px solid rgb(204, 204, 204)",
                borderRight: "2px solid rgb(204, 204, 204)",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                display: "inline",
                width: "150px",
                fontWeight: index === selectedTab ? "bold" : "normal",
                backgroundColor:
                  index === selectedTab
                    ? "rgb(204, 204, 204)"
                    : "rgb(255, 255, 255)",
              }}
            >
              {tab.label}
            </div>
          );
        })}
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
