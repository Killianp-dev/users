import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EmailPage from './pages/EmailPage.jsx'
import PasswordChangePage from './pages/PasswordChangePage.jsx'
import PasswordResetPage from './pages/PasswordResetPage.jsx'
import LogoutPage from './pages/LogoutPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/accounts/email/" element={<EmailPage />} />
        <Route path="/accounts/password/change/" element={<PasswordChangePage />} />
        <Route path="/accounts/password/reset/" element={<PasswordResetPage />} />
        <Route path="/accounts/logout/" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
