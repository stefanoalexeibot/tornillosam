import { Card, CardContent } from "@/components/ui/card"
import { Shield, Nut, Anchor, Box, Settings, Layers } from "lucide-react"

const categories = [
  { name: "Tornillería", description: "Estructurales, automotrices y gigantes.", icon: Nut },
  { name: "Tuercas", description: "Seguridad, flange y hexagonales.", icon: Settings },
  { name: "Pijas y Birlos", description: "Fijación industrial de alta resistencia.", icon: Anchor },
  { name: "Soportería", description: "Unicanales y sistemas de soporte.", icon: Box },
  { name: "Arandelas", description: "Rondanas estándar y especiales.", icon: Layers },
  { name: "Automotriz", description: "Grapas plásticas y birlos originales.", icon: Shield },
]

export function Categories() {
  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Catálogo Especializado</h2>
            <p className="text-slate-500">
              Contamos con la infraestructura necesaria para suministrar proyectos de cualquier escala, desde fijaciones estándar hasta piezas sobre diseño.
            </p>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
            Ver todas las categorías
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden border-slate-200">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <category.icon className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-sm text-slate-500">{category.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
