export function Brands() {
  return (
    <section className="py-12 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
          Distribuidor Autorizado de Marcas Líderes
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {["HELI-COIL", "3M", "LOCTITE", "HAAS", "DEWALT", "STANLEY"].map((brand) => (
            <span key={brand} className="text-2xl font-black text-slate-800 tracking-tighter cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
