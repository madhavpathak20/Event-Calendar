import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { EventProvider } from './context/EventContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventProvider>
      <App />
    </EventProvider>
  </StrictMode>,
)
