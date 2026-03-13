import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { CartSheet } from "./CartSheet"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    { label: "Catálogo", to: "/catalogo" },
    { label: "Servicios", to: "/servicios" },
    { label: "Nosotros", to: "/nosotros" },
    { label: "Contacto", to: "/contacto" },
  ]

  const priceListLink = { label: "Lista de Precios", to: "/lista-precios" }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center justify-between px-6 py-4 sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-100/50 shadow-sm shadow-slate-100/50"
            : "bg-white border-b border-slate-100"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            transition={{ duration: 0.2 }}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <span className="text-white font-black text-sm tracking-tight">AM</span>
          </motion.div>
          <span className="font-black text-xl tracking-tight text-slate-900">TORNILLOS AM</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ label, to }) => {
            const isActive = location.pathname === to
            return (
              <Link key={to} to={to} className="relative px-4 py-2 text-sm font-bold group">
                <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-primary" : "text-slate-600 group-hover:text-primary"}`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/5 rounded-xl"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={priceListLink.to}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
              location.pathname === priceListLink.to
                ? "bg-primary text-white border-primary"
                : "border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary bg-slate-50"
            }`}
          >
            <span>🔒</span> {priceListLink.label}
          </Link>
          <CartSheet />
          <Link to="/contacto" className="hidden md:block">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button className="rounded-xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                Cotizar ahora
              </Button>
            </motion.div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-1 sticky top-[73px] z-40 shadow-lg"
          >
            {links.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  location.pathname === to
                    ? "text-primary bg-primary/5"
                    : "text-slate-700 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <Link
                to={priceListLink.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  location.pathname === priceListLink.to
                    ? "text-primary bg-primary/5"
                    : "text-slate-700 hover:text-primary hover:bg-slate-50"
                }`}
              >
                <span>🔒</span> {priceListLink.label}
              </Link>
              <Link to="/contacto" onClick={() => setMenuOpen(false)}>
                <Button className="w-full rounded-xl font-black">Cotizar ahora</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
