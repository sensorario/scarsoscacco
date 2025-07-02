import PropTypes from "prop-types";

export default function Header({ version, currentUser }) {
  return (
    <header className="app-header">
      <h1 className="app-title">
        Scarso Scacco {currentUser ? `(${currentUser.name})` : ""}
      </h1>

      {!currentUser && (
        <button
          className="btn btn-secondary"
          onClick={() => window.api.electronAPI.invoke("open-google-login")}
        >
          Login con Google
        </button>
      )}

      <span className="app-version">v{version}</span>
    </header>
  );
}

Header.propTypes = {
  version: PropTypes.string.isRequired,
  currentOpening: PropTypes.string,
  handleOpeningSelect: PropTypes.func.isRequired,
};
