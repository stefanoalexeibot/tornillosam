import { useState } from "react"
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Shield } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  const handleCRMAccess = () => {
    const password = prompt("Ingresa la contraseña de acceso al CRM:")
    if (password === "tornillos2024") {
      // Redirigir al CRM en producción
      window.location.href = "https://tornillosam.vercel.app/crm"
    } else if (password !== null) {
      alert("Contraseña incorrecta.")
    }
  }

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-10 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">TORNILLOS AM</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Líderes en soluciones de sujeción industrial con más de una década de experiencia en el mercado nacional.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/tornilleriaAM"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/tornillos_am/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-gradient-to-br hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-pink-400 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/alejandro-luna-b01797279/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Categorías</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">Tornillería Estructural</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Birlos Automotrices</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Varillas y Opresores</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Soportería Unicanal</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Empresa</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/nosotros" className="hover:text-primary transition-colors">Nosotros</Link></li>
              <li><Link to="/servicios" className="hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Ubicación</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog Industrial</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contacto Monterrey</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-slate-500">
                  Vicente Guerrero 2226, Quince de Mayo (Larralde), 64450 Monterrey, N.L.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-slate-500">+52 (81) 2198-0008</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-slate-500">a.luna@tornillosam.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2024 Tornillos AM Industrial. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <button 
              onClick={handleCRMAccess}
              className="hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3" />
              Acceso Staff
            </button>
            <a href="#" className="hover:text-slate-600">Aviso de Privacidad</a>
            <a href="#" className="hover:text-slate-600">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
