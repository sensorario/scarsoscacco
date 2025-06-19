import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Chessboard } from "react-chessboard";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div style={{ width: "500px", height: "500px" }}>
          <Chessboard boardWith={400}/>
        </div>
    </>
  )
}

export default App
