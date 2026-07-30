import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HardwareProvider } from './context/HardwareContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <HardwareProvider>
        <App />
      </HardwareProvider>
    </LanguageProvider>
  </StrictMode>,
)
