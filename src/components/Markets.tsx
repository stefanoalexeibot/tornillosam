const markets = [
  { name: "Automotriz", image: "https://images.unsplash.com/photo-1593531063212-3b02213e4823?q=80&w=800&auto=format&fit=crop" },
  { name: "Aeroespacial", image: "https://images.unsplash.com/photo-1541188495357-ad2dc89487f4?q=80&w=800&auto=format&fit=crop" },
  { name: "Alimenticio", image: "https://images.unsplash.com/photo-1581092921461-7d657597555a?q=80&w=800&auto=format&fit=crop" },
  { name: "Energético", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop" },
]

export function Markets() {
  return (
    <section className="py-24 bg-white px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Presencia en Industrias Críticas</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Nuestros productos forman parte de los procesos productivos más exigentes del país.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {markets.map((market, index) => (
            <div key={index} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-slate-900 font-bold text-lg md:text-xl tracking-tight group-hover:text-primary transition-colors">{market.name}</h3>
                <div className="w-8 h-1 bg-primary mt-2 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Espacio para Imagen</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
