import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HardwareProvider } from './context/HardwareContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HardwareProvider>
      <App />
    </HardwareProvider>
  </StrictMode>,
)
