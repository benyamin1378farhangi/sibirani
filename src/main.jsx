import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/vazirmatn'
import './index.css'
import App from './App.jsx'
import { TranslationsProvider } from './context/TranslationsContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <TranslationsProvider>
          <App />
        </TranslationsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
