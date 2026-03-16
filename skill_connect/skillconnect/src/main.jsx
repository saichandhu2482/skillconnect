import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from './context/Session'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SessionProvider>
      <App />
    </SessionProvider>
  </BrowserRouter>
)