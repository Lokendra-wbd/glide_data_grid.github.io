import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import LrvPage from './components/lrv/LrvPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lrv" element={<LrvPage />} />
      </Routes>
    </BrowserRouter>
  )
}
