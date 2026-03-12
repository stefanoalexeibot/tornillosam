import { ShieldCheck, Truck, Clock, Wrench } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { fadeInUp, staggerContainer } from "@/lib/animations"

const features = [
  {
    title: "Calidad Certificada",
    description: "Cada pieza cumple con los estándares internacionales más rigurosos (ISO/DIN).",
    icon: ShieldCheck,
    color: "from-blue-500 to-primary",
    bg: "bg-blue-50",
    iconColor: "text-primary"
  },
  {
    title: "Distribución Ágil",
    description: "Contamos con logística propia para garantizar entregas en menos de 24 horas locales.",
    icon: Truck,
    color: "from-green-400 to-emerald-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    title: "Disponibilidad 24/7",
    description: "Nuestro catálogo online permite consultar existencias y generar cotizaciones al instante.",
    icon: Clock,
    color: "from-orange-400 to-amber-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-500"
  },
  {
    title: "Asesoría Técnica",
    description: "Expertos listos para ayudarte a elegir la fijación correcta para tu proyecto.",
    icon: Wrench,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-500"
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <section className="py-28 bg-white px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-white -z-10" />
      
      <div className="container mx-auto">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.p variants={fadeInUp} className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">
            Por qué elegirnos
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tighter italic leading-[1.1]">
            Potenciando la industria con <span className="text-primary">precisión</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-500 leading-relaxed font-medium">
            No solo vendemos tornillos, ofrecemos soluciones integrales de fijación para los sectores más exigentes de la industria nacional.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-transparent overflow-hidden cursor-pointer"
            >
              {/* Hover gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[32px]`} />
              
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>
              <h3 className="font-black text-slate-900 mb-3 text-lg">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
