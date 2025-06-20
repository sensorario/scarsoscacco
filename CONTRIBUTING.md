# Contributing to Scarso Scacco ♟️

Thank you for your interest in contributing to Scarso Scacco! This document provides guidelines and information for developers who want to contribute to the project.

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** (comes with Node.js)
- **Git**
- Code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/chess-electron-react.git
   cd chess-electron-react
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development**:
   ```bash
   # Terminal 1: Start Vite dev server
   npm run dev
   
   # Terminal 2: Start Electron
   npm run electron
   ```

## 🏗️ Project Architecture

### File Structure
```
chess-electron-react/
├── electron/
│   ├── main.cjs          # Main Electron process
│   └── preload.js        # IPC bridge
├── src/
│   ├── App.jsx           # Main React component
│   ├── App.css           # Component styles
│   ├── index.css         # Global styles
│   └── main.jsx          # React entry point
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

### Key Components

- **Main Process** (`electron/main.cjs`): Handles Stockfish, Chess.js, IPC
- **Preload Script** (`electron/preload.js`): Secure IPC bridge
- **React App** (`src/App.jsx`): UI, chessboard, move history
- **Styling**: LinkedIn-inspired theme with Inter font

## 📝 Coding Standards

### JavaScript/React
- Use **ES6+ syntax**
- **Functional components** with hooks
- **Descriptive variable names**
- **Comments for complex logic**

### Code Style
```javascript
// ✅ Good
const handleStockfishMove = async () => {
  try {
    const bestMove = await window.api.stockfish.getBestMove(fen);
    // Process move...
  } catch (error) {
    console.error("Stockfish error:", error);
  }
};

// ❌ Bad
const handleMove = async () => {
  const move = await window.api.stockfish.getBestMove(fen);
  // No error handling
};
```

### Styling
- Use **inline styles** for component-specific styling
- Follow **LinkedIn color scheme**: `#0077B5` primary
- Use **Inter font** for consistency
- **Responsive design** principles

## 🧪 Testing

### Manual Testing
1. **Basic functionality**:
   - Make moves on the chessboard
   - Verify Stockfish responds
   - Test reset functionality
   - Check move history

2. **UI/UX**:
   - Auto-scroll in move history
   - Button hover effects
   - Responsive layout

3. **Cross-platform**:
   ```bash
   npm run dist:mac
   npm run dist:win
   npm run dist:linux
   ```

### Debug Mode
```bash
npm run electron
```
This opens developer tools for debugging.

## 🔧 Making Changes

### Before You Start
1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Check existing issues** to avoid duplication
3. **Discuss major changes** in issues first

### Development Workflow

1. **Make your changes**
2. **Test thoroughly**:
   ```bash
   npm run build
   npm run electron
   ```

3. **Check for errors**:
   - Console errors
   - Build warnings
   - UI glitches

4. **Update version** (if needed):
   ```json
   {
     "version": "1.1.0"
   }
   ```

## 📋 Common Tasks

### Adding New Features

1. **UI Changes**: Modify `src/App.jsx`
2. **Chess Logic**: Update `electron/main.cjs`
3. **IPC Communication**: Add to `electron/preload.js`

### Styling Changes

```javascript
// Follow existing pattern
style={{
  backgroundColor: "#0077B5",
  color: "white",
  padding: "12px 24px",
  borderRadius: "6px",
  fontFamily: "inherit",
}}
```

### Version Updates

The version in `package.json` automatically updates:
- App header display
- Build file names
- Installer names

## 🚦 Pull Request Process

### Before Submitting

1. **Test your changes**:
   ```bash
   npm run build
   npm run dist
   ```

2. **Check the build** works on target platforms
3. **Update documentation** if needed
4. **Write clear commit messages**:
   ```bash
   git commit -m "feat: add auto-save functionality"
   git commit -m "fix: resolve Stockfish timeout issue"
   git commit -m "docs: update installation instructions"
   ```

### PR Guidelines

1. **Clear title and description**
2. **Reference related issues**
3. **Include screenshots** for UI changes
4. **List breaking changes** (if any)
5. **Test instructions** for reviewers

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Build successful
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots here]
```

## 🐛 Reporting Issues

### Bug Reports
Include:
- **OS and version**
- **Node.js version**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Console errors/logs**
- **Screenshots**

### Feature Requests
Include:
- **Use case description**
- **Proposed solution**
- **Alternative solutions**
- **Additional context**

## 🔍 Code Review Guidelines

### For Contributors
- **Small, focused PRs** are easier to review
- **Respond to feedback** promptly
- **Be open to suggestions**

### For Reviewers
- **Be constructive** and helpful
- **Focus on code quality** and maintainability
- **Test the changes** locally
- **Check for edge cases**

## 📚 Useful Resources

### Dependencies Documentation
- [Electron Documentation](https://electronjs.org/docs)
- [React Documentation](https://react.dev/learn)
- [Chess.js Documentation](https://github.com/jhlywa/chess.js)
- [React Chessboard](https://github.com/Clariity/react-chessboard)
- [Stockfish.wasm](https://github.com/niklasf/stockfish.wasm)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Electron DevTools](https://electronjs.org/docs/tutorial/using-devtools)

## 💡 Tips for New Contributors

1. **Start small**: Look for issues labeled "good first issue"
2. **Ask questions**: Don't hesitate to ask in issues/discussions
3. **Read existing code**: Understand the patterns before making changes
4. **Test thoroughly**: Both development and production builds
5. **Document your changes**: Update README/docs when needed

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page (when available)

## 📞 Getting Help

- **Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: [maintainer-email] for private concerns

---

**Happy coding! ♟️**

Together, let's make Scarso Scacco the best chess app it can be! 🎯