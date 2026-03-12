import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import CatalogPage from "@/pages/CatalogPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
