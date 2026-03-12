import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Layers, 
  Hammer, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ServicesPage() {
  const mainServices = [
    {
      title: "Maquinado CNC de Precisión",
      description: "Servicios de torneado y fresado CNC para piezas de alta complejidad. Trabajamos con tolerancias mínimas para sectores industriales exigentes.",
      icon: Settings,
      tags: ["CNC", "Torno", "Fresado"],
      image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Fabricación de Piezas Especiales",
      description: "Desarrollo de tornillería y piezas bajo plano o muestra. Si no existe en el catálogo, lo fabricamos a la medida de sus necesidades.",
      icon: Hammer,
      tags: ["Bajo Plano", "Especiales", "Diseño"],
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Tratamientos Térmicos y Acabados",
      description: "Mejoramos las propiedades mecánicas de sus piezas mediante temple, revenido, pavonado, zincado y más.",
      icon: Layers,
      tags: ["Temple", "Pavonado", "Zincado"],
      image: "https://images.unsplash.com/photo-1565264319409-201b1a4542d1?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900"></div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <Badge variant="outline" className="mb-6 text-primary border-primary/50 py-1 px-4 text-sm font-bold uppercase tracking-widest bg-primary/5">
              Nuestras Capacidades
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Soluciones de <span className="text-primary italic">Maquinado</span> e Ingeniería Industrial
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Más que tornillería, somos su aliado en la fabricación de componentes críticos con los más altos estándares de calidad en Monterrey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 gap-2 w-full sm:w-auto">
                Solicitar Cotización Técnica <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Services Detail */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="space-y-24">
              {mainServices.map((service, index) => (
                <div key={index} className={`flex flex-col lg:items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex p-4 rounded-3xl bg-slate-50 text-primary border border-slate-100">
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-3 py-1 border-none uppercase text-[10px] tracking-wide">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-2 border-slate-100 hover:border-primary hover:text-primary transition-all gap-2">
                        Ver detalles <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                      <div className="relative rounded-[40px] overflow-hidden border-8 border-white shadow-2xl">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us / Technical Stats */}
        <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter">
                ¿Por qué confiar en nosotros?
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                Nuestra experiencia técnica y compromiso con la excelencia nos avalan en cada proyecto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Calidad Certificada", desc: "Procesos rigurosos bajo normativas internacionales.", icon: ShieldCheck },
                { title: "Entrega Express", desc: "Compromiso con los tiempos más cortos del mercado.", icon: Zap },
                { title: "Atención 24/7", desc: "Soporte técnico para emergencias industriales.", icon: Clock },
                { title: "Precisión Total", desc: "Uso de herramientas de medición de última generación.", icon: CheckCircle2 }
              ].map((item, idx) => (
                <Card key={idx} className="bg-white border-none shadow-sm hover:shadow-xl transition-shadow rounded-3xl overflow-hidden p-8 group">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-primary text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <h2 className="text-4xl md:text-6xl font-black leading-tight italic tracking-tighter">
                ¿Tienes un plano o una pieza especial?
              </h2>
              <p className="text-primary-foreground/80 text-xl font-medium">
                Envíanos los detalles hoy mismo y recibe una cotización técnica sin compromiso.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button size="lg" variant="secondary" className="h-16 px-10 rounded-2xl font-black text-xl bg-white text-primary hover:bg-slate-100 shadow-2xl transition-all">
                  Contactar Ingeniería
                </Button>
                <div className="text-left">
                  <p className="text-sm font-bold uppercase tracking-widest text-primary-foreground/50 mb-1">O llámanos directo:</p>
                  <p className="text-2xl font-black">+52 (81) 1234-5678</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
