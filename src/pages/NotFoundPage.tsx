import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-lg space-y-8"
        >
          {/* Giant 404 */}
          <motion.div variants={fadeInUp} className="relative">
            <span className="text-[180px] font-black text-slate-100 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-[24px] bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Página no encontrada
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              La página o el producto que buscas no existe o fue movido. Pero tenemos más de{" "}
              <strong className="text-slate-800">13,000 SKUs</strong> disponibles para ti.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogo">
              <Button className="h-14 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                <Search className="w-4 h-4" /> Ver Catálogo
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-2xl font-black gap-2 border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all w-full sm:w-auto"
              >
                <Home className="w-4 h-4" /> Ir al Inicio
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <button
              onClick={() => window.history.back()}
              className="text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a la página anterior
            </button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
