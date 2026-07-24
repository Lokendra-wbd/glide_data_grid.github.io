import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import LrvPage from './components/lrv/LrvPage'
import { getRouterBasename } from './routerBasename'

export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lrv" element={<LrvPage />} />
      </Routes>
    </BrowserRouter>
  )
}
