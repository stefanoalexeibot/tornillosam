import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Linkedin,
  Facebook
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO 
        title="Contacto | Tornillos AM" 
        description="Solicita cotizaciones, soporte técnico o visítanos en Monterrey. Estamos listos para ayudarte."
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-white pt-24 pb-16 px-6">
          <div className="container mx-auto text-center">
            <Badge className="bg-primary/10 text-primary border-none mb-6 px-4 py-1 font-bold">
              Canales Directos
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 italic">
              Estamos a un <span className="text-primary">Mensaje</span> de Distancia
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Escríbenos para dudas técnicas, cotizaciones masivas o soporte. Respondemos en menos de 2 horas en horario laboral.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form Side */}
              <div className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Envíenos un mensaje</h2>
                  <p className="text-sm text-slate-400 font-medium">Sus datos serán manejados bajo nuestra política de privacidad.</p>
                </div>
                
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                      <Input placeholder="Ej. Juan Pérez" className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                      <Input placeholder="juan@empresa.com" className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary/20" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asunto / Especialidad</label>
                    <Input placeholder="Ej. Cotización para Maquinado CNC" className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary/20" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensaje</label>
                    <textarea 
                      className="w-full min-h-[150px] bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Detalla tu requerimiento o dudas técnicas..."
                    ></textarea>
                  </div>
                  
                  <Button className="w-full h-16 rounded-[24px] font-black text-lg gap-3 shadow-xl shadow-primary/20 group">
                    Enviar Mensaje <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              </div>

              {/* Info Side */}
              <div className="space-y-10 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Ventas y Soporte", value: "+52 (81) 2198-0008", icon: Phone, color: "text-blue-500" },
                    { title: "WhatsApp Directo", value: "+52 81 2198 0008", icon: MessageCircle, color: "text-green-500" },
                    { title: "Correo Oficial", value: "a.luna@tornillosam.com", icon: Mail, color: "text-primary" },
                    { title: "Horarios", value: "Lun - Vie: 8am - 6pm", icon: Clock, color: "text-slate-900" }
                  ].map((item, idx) => (
                    <Card key={idx} className="bg-white border-none shadow-sm rounded-3xl p-6 group cursor-pointer hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${item.color} group-hover:bg-primary group-hover:text-white transition-all`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.title}</p>
                          <p className="text-slate-900 font-extrabold text-sm">{item.value}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Nuestra Planta</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        Vicente Guerrero 2226, Quince de Mayo (Larralde),<br />
                        64450 Monterrey, N.L.
                      </p>
                    </div>
                  </div>
                  
                  {/* Google Maps Embed */}
                  <div className="w-full rounded-3xl overflow-hidden" style={{height: '280px'}}>
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3595.2827100086574!2d-100.31368468831434!3d25.695062077299536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866295c8aadc8b43%3A0x819df94d6b8868bf!2sTornillos%20AM%20SA%20de%20CV!5e0!3m2!1ses-419!2smx!4v1773355754970!5m2!1ses-419!2smx"
                      width="100%" 
                      height="100%" 
                      style={{border: 0}} 
                      allowFullScreen 
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 px-4 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                  Síguenos:
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white hover:text-primary"><Linkedin className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white hover:text-primary"><Facebook className="w-5 h-5" /></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
