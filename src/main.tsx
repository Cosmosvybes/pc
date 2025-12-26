import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Terms from './pages/legal/Terms.tsx'
import Privacy from './pages/legal/Privacy.tsx'
import Refund from './pages/legal/Refund.tsx'

import Pricing from './pages/Pricing.tsx'
import Shop from './pages/Shop.tsx'
import ScriptBook from './pages/admin/ScriptBook.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/print-script-book" element={<ScriptBook />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
