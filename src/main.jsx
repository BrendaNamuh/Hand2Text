import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GeistProvider, CssBaseline } from '@geist-ui/core'

createRoot(document.getElementById('root')).render(
  <GeistProvider>
    <CssBaseline /> 
    <App />
  </GeistProvider>
)
