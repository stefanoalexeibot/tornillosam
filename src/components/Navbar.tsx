import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">AM</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">TORNILLOS AM</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-primary transition-colors">Catálogo</a>
        <a href="#" className="hover:text-primary transition-colors">Servicios</a>
        <a href="#" className="hover:text-primary transition-colors">Nosotros</a>
        <a href="#" className="hover:text-primary transition-colors">Contacto</a>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5 text-slate-600" />
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-white font-medium">Cotizar ahora</Button>
      </div>
    </nav>
  )
}
