import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">TORNILLOS AM</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Líderes en soluciones de sujeción industrial con más de una década de experiencia en el mercado nacional.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
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
              <li><a href="#" className="hover:text-primary transition-colors">Nosotros</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Infraestructura</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bolsa de Trabajo</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog Industrial</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contacto Monterrey</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-slate-500">
                  Guerrero 2226, 64450 Monterrey, N.L.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-slate-500">(81) 2900 0580</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-slate-500">ventas@tornillosam.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2024 Tornillos AM Industrial. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600">Aviso de Privacidad</a>
            <a href="#" className="hover:text-slate-600">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
