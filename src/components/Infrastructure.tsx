import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export function Infrastructure() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 transform translate-x-20"></div>
      
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative z-10 flex items-center justify-center">
            <div className="text-slate-500 text-sm font-medium">Contenido Visual: Taller Haas / Maquinado</div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 p-6 bg-primary rounded-xl shadow-xl z-20 hidden md:block">
            <p className="text-3xl font-extrabold text-white">10+</p>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Años de Excelencia</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">Maquinado y Acabados de Clase Mundial</h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Nuestra capacidad productiva se extiende más allá del suministro. Contamos con un taller de maquinado equipado con tecnología <span className="text-white font-bold italic">Haas</span> para fabricaciones especiales.
          </p>
          
          <ul className="space-y-4 mb-10">
            {[
              "Taller de Maquinado de Precisión",
              "Servicios de Galvanizado y Zincado",
              "Fabricación sobre plano o muestra",
              "Certificación de materiales ISO/DIN"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="outline" className="border-slate-700 text-white hover:bg-white hover:text-slate-900 h-12 px-8 font-bold">
            Conocer Infraestructura
          </Button>
        </div>
      </div>
    </section>
  )
}
