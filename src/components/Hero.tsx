import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-slate-50 opacity-50 skew-x-12 transform translate-x-20"></div>
      
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Líderes en Fijaciones Industriales
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Cualquier tornillo, <br />
            <span className="text-primary italic">en segundos.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Especialistas en tornillería, birlos y fijaciones de alta resistencia. Acceso instantáneo a más de 8,000 SKUs con calidad certificada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar medida o tipo (ej. M8 x 40)" 
                className="pl-10 h-12 border-slate-200 focus:ring-primary h-14"
              />
            </div>
            <Button className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              Ver Catálogo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-8 text-slate-400">
            <div>
              <span className="block text-2xl font-bold text-slate-900">+8k</span>
              <span className="text-sm">Productos</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <span className="block text-2xl font-bold text-slate-900">24h</span>
              <span className="text-sm">Envío Express</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div>
              <span className="block text-2xl font-bold text-slate-900">99.9%</span>
              <span className="text-sm">Stock Real</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center border-2 border-dashed border-slate-200">
            <div className="text-slate-400 text-sm font-medium">Imagen Hero (Tornillería)</div>
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -left-6 p-6 bg-white rounded-2xl shadow-xl border border-slate-100 hidden md:block">
            <p className="text-sm font-medium text-slate-500 mb-2 italic">"La mejor calidad en el mercado"</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200"></div>
              <div>
                <p className="text-xs font-bold text-slate-900">Ing. Ricardo S.</p>
                <p className="text-[10px] text-slate-400">Constructor Civil</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
