import PropTypes from "prop-types";

export default function Header({ version }) {
  return (
    <header className="app-header">
      <h1 className="app-title">Scarso Scacco</h1>
      <span className="app-version">v{version}</span>
    </header>
  );
}

Header.propTypes = {
  version: PropTypes.string.isRequired,
};
