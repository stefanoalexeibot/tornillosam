import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <footer className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          © 2024 Tornillos AM. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
