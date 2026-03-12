import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Target, 
  Users, 
  Award,
  Factory,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Intro Section */}
        <section className="pt-24 pb-16 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 font-bold">
                  Nuestra Historia
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                  Tornillos AM: <span className="text-primary italic">Maestros</span> en Soluciones Industriales
                </h1>
                <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
                  Desde nuestra fundación en Monterrey, nos hemos dedicado a proveer las refacciones más confiables y el soporte técnico más especializado para la industria nacional. Nuestra pasión por la precisión nos define.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-100">
                  {[
                    { label: "Años de Experiencia", value: "25+" },
                    { label: "Piezas en Stock", value: "13K+" },
                    { label: "Clientes Felices", value: "500+" },
                    { label: "Proyectos Especiales", value: "1200+" }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-3xl font-black text-primary italic uppercase tracking-tighter">{stat.value}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="absolute -inset-10 bg-primary/5 rounded-[60px] blur-3xl -z-10"></div>
                <div className="relative rounded-[50px] overflow-hidden shadow-2xl border-8 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200" 
                    alt="Planta Tornillos AM" 
                    className="w-full h-full object-cover aspect-square"
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                        <Factory className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base de Operaciones</p>
                        <p className="text-slate-900 font-black">Santa Catarina, NL</p>
                      </div>
                    </div>
                    <ChevronRight className="text-primary w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission / Vision Cards */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Nuestra Misión",
                  desc: "Facilitar el éxito de nuestros clientes proveyendo refacciones industriales de la más alta calidad con un tiempo de entrega inmejorable.",
                  icon: Target,
                  color: "bg-blue-500"
                },
                {
                  title: "Nuestra Visión",
                  desc: "Ser el referente nacional en la fabricación y distribución de tornillería especializada para sectores energéticos y de manufactura.",
                  icon: History,
                  color: "bg-primary"
                },
                {
                  title: "Valores AM",
                  desc: "Honestidad, precisión milimétrica y compromiso con el desarrollo industrial de nuestra región.",
                  icon: Users,
                  color: "bg-slate-900"
                }
              ].map((item, idx) => (
                <Card key={idx} className="bg-white border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[40px] p-10 group overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/20`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Culture Teaser */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-400 font-bold text-xs uppercase tracking-widest">
                <Award className="w-4 h-4 text-primary" />
                Compromiso con el Éxito
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter leading-tight">
                Contamos con un equipo de <span className="text-primary italic">expertos</span> listos para su próximo gran proyecto.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                No solo vendemos tornillos, brindamos consultoría técnica para que su operación nunca se detenga. Conozca por qué las empresas líderes confían en nosotros.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
