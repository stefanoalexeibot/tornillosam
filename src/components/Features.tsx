import { ShieldCheck, Truck, Clock, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Calidad Certificada",
    description: "Cada pieza cumple con los estándares internacionales más rigurosos (ISO/DIN).",
    icon: ShieldCheck,
  },
  {
    title: "Distribución Ágil",
    description: "Contamos con logística propia para garantizar entregas en menos de 24 horas locales.",
    icon: Truck,
  },
  {
    title: "Disponibilidad 24/7",
    description: "Nuestro catálogo online permite consultar existencias y generar cotizaciones al instante.",
    icon: Clock,
  },
  {
    title: "Asesoría Técnica",
    description: "Expertos listos para ayudarte a elegir la fijación correcta para tu proyecto.",
    icon: Wrench,
  },
]

export function Features() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Potenciando la industria con precisión</h2>
          <p className="text-slate-500 leading-relaxed">
            No solo vendemos tornillos, ofrecemos soluciones integrales de fijación para los sectores más exigentes de la industria nacional.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-none hover:bg-slate-50 transition-colors group p-4">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
