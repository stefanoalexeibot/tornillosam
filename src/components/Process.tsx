import { Search, ClipboardList, PackageCheck } from "lucide-react"

const steps = [
  {
    title: "Busca tu producto",
    description: "Usa nuestro buscador inteligente para encontrar entre más de 8,000 SKUs por medida o tipo.",
    icon: Search
  },
  {
    title: "Solicita Cotización",
    description: "Agrega las cantidades necesarias a tu lista y envíala en un clic para recibir tu presupuesto.",
    icon: ClipboardList
  },
  {
    title: "Recibe y Confirma",
    description: "Procesamos tu pedido y gestionamos el envío express a cualquier parte de la república.",
    icon: PackageCheck
  }
]

export function Process() {
  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Abastecimiento Simplificado</h2>
          <p className="text-slate-500">
            Diseñamos un flujo de trabajo optimizado para que el suministro nunca detenga tu producción.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Arrow connectors (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px border-t-2 border-dashed border-slate-200 -z-10"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative bg-white border border-slate-100 shadow-sm">
                <step.icon className="w-8 h-8 text-primary" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
