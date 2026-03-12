import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate("/catalogo")
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [5, 0, 5] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Líderes en Fijaciones Industriales
            </motion.div>

            <div className="space-y-2">
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
                Cualquier tornillo,
              </motion.h1>
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-black text-primary italic tracking-tight leading-[1.05]">
                en segundos.
              </motion.h1>
            </div>

            <motion.p variants={fadeInUp} className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              Especialistas en tornillería, birlos y fijaciones de alta resistencia. Acceso instantáneo a más de <strong className="text-slate-800">13,000 SKUs</strong> con calidad certificada.
            </motion.p>

            <motion.form
              variants={fadeInUp}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca por medida o SKU (ej: M8x40, pija 8x1)"
                  className="pl-12 h-16 rounded-2xl text-base border-2 border-slate-200 focus:border-primary/50 bg-white shadow-sm w-full"
                />
              </div>
              <Button
                type="submit"
                className="h-16 px-8 rounded-2xl font-black text-base gap-2 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
              >
                Buscar <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.form>

            <motion.div variants={fadeInUp}>
              <Link to="/contacto" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                ¿No encuentras lo que buscas? Contáctanos directamente →
              </Link>
            </motion.div>

            {/* Animated Stats */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-8 pt-4">
              {[
                { value: "+13K", label: "SKUs en Catálogo" },
                { value: "25+", label: "Años de Experiencia" },
                { value: "24h", label: "Entrega Express" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <span className="block text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/10 rounded-[50px] blur-3xl scale-90" />

              {/* Main image */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[50px] overflow-hidden shadow-2xl border border-slate-100"
              >
                <img
                  src="https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=900"
                  alt="Tornillos AM - Maquinados Industriales"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </motion.div>

              {/* Floating card 1 - Top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="absolute -top-6 -right-6 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 hidden md:flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cargados</p>
                  <p className="text-xl font-black text-slate-900">13,531 SKUs</p>
                </div>
              </motion.div>

              {/* Floating card 2 - Bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 hidden md:flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">
                  ✅
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Calidad</p>
                  <p className="text-base font-black text-slate-900">Certificada en Mty.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
