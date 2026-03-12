import { Nut, Settings, Anchor, Box, Layers, Shield, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { Link } from "react-router-dom"

const categories = [
  { name: "Tornillería", description: "Estructurales, automotrices y gigantes.", icon: Nut, count: "3,200+" },
  { name: "Tuercas", description: "Seguridad, flange y hexagonales.", icon: Settings, count: "1,800+" },
  { name: "Pijas y Birlos", description: "Fijación industrial de alta resistencia.", icon: Anchor, count: "2,100+" },
  { name: "Soportería", description: "Unicanales y sistemas de soporte.", icon: Box, count: "900+" },
  { name: "Arandelas", description: "Rondanas estándar y especiales.", icon: Layers, count: "1,200+" },
  { name: "Automotriz", description: "Grapas plásticas y birlos originales.", icon: Shield, count: "2,300+" },
]

export function Categories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" })

  return (
    <section className="py-28 bg-slate-50 px-6">
      <div className="container mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          ref={ref}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="max-w-xl space-y-4">
            <motion.p variants={fadeInUp} className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
              Catálogo
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-[1.1]">
              Una pieza <span className="text-primary">para cada proyecto</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 font-medium leading-relaxed">
              Contamos con la infraestructura necesaria para suministrar proyectos de cualquier escala.
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link to="/catalogo">
              <motion.button
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="text-primary font-black text-sm flex items-center gap-2 hover:gap-4 transition-all duration-300 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md"
              >
                Ver catálogo completo <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25 }}
            >
              <Link to={`/catalogo?cat=${category.name}`} className="block group">
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/3 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                      <category.icon className="w-7 h-7 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-slate-900 mb-1 text-lg group-hover:text-primary transition-colors">{category.name}</h3>
                        <span className="text-[10px] font-black text-primary/60 bg-primary/5 px-2 py-1 rounded-full uppercase tracking-wide">{category.count}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{category.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center text-xs font-black text-primary gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Ver productos <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
