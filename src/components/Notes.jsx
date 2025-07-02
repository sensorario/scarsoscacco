export default function Notes({
  fen,
  currentUser,
  formattedFenMessages,
  loadNotesHandler,
}) {
  const saveNoteHandler = () => {
    const message = document.getElementById("fen-message").value;
    fetch("https://simonegentili.com/api/chess/fen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fen, message, currentUser }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("fen-message").value = "";
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching FEN:", error);
      });
  };

  return (
    <div className="">
      <input
        type="text"
        style={{
          margin: "15px",
          padding: "15px",
          border: "2px solid #ccc",
          borderRadius: "5px",
          width: "calc(100% - 30px)",
        }}
        value={fen}
        readOnly
      />
      <div
        id="fen-message-container"
        style={{
          gap: "15px",
          display: "flex",
        }}
      >
        <input
          id="fen-message"
          type="text"
          style={{
            padding: "15px",
            border: "2px solid #ccc",
            borderRadius: "5px",
            width: "calc(100% - 30px)",
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            saveNoteHandler();
            loadNotesHandler();
          }}
        >
          SALVA
        </button>
      </div>

      {formattedFenMessages && (
        <ul>
          {formattedFenMessages.map((message, index) => {
            return (
              <li key={index} style={{ textAlign: "left" }}>
                {message.message}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
