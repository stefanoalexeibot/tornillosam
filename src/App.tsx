import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import CatalogPage from "@/pages/CatalogPage"
import ServicesPage from "@/pages/ServicesPage"
import AboutPage from "@/pages/AboutPage"
import ContactPage from "@/pages/ContactPage"
import ProductPage from "@/pages/ProductPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/producto/:sku" element={<ProductPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
