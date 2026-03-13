import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Search, Lock, FileDown, Printer, Eye, EyeOff,
  ChevronLeft, ChevronRight, X, FileSpreadsheet,
  Building2, Phone, Mail, Lightbulb, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { applySmartSearch } from "@/lib/search-utils";

/* ─── Configuración ─────────────────────────────────────────── */
const ACCESS_CODE   = import.meta.env.VITE_PRICELIST_CODE ?? "tornillos2024";
// price en BD = $ LISTA / 2  →  precio cliente = price × 2 × 0.235 × 1.70 = price × 0.799
const MARKUP_FACTOR = 2 * (1 - 0.765) * 1.70;
const PAGE_SIZE     = 50;
const SESSION_KEY   = "pricelist_auth";

/* ─── Helpers ────────────────────────────────────────────────── */
function calcSellPrice(dbPrice: number) { return dbPrice * MARKUP_FACTOR; }
function fmt(n: number) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Product { id: string; name: string; sku: string; category: string; price: number; }

const SEARCH_HINTS = [
  "tornillo hexagonal 1/2",
  "pija inox 8x1",
  "tuerca M10",
  "grado 8 5/16",
  "SKU: 1010002010",
];

const QUICK_SEARCHES = [
  "Hexagonales", "Inoxidable", "Grado 8", "Pijas", "Tuercas", "Rondanas", "Socket",
];

/* ═══════════════════════════════════════════════════════════════ */
/*  PASSWORD GATE                                                   */
/* ═══════════════════════════════════════════════════════════════ */
function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode]       = useState("");
  const [error, setError]     = useState(false);
  const [showCode, setShowCode] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === ACCESS_CODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setError(true);
      setCode("");
      setTimeout(() => setError(false), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="bg-white rounded-[36px] p-10 border border-slate-100 shadow-2xl shadow-slate-200/60 text-center space-y-8">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
              <Lock className="w-9 h-9 text-primary" />
            </div>
            <div className="space-y-3">
              <Badge className="bg-primary/10 text-primary border-none font-black text-xs px-4 py-1.5">
                Acceso Exclusivo
              </Badge>
              <h1 className="text-3xl font-black text-slate-900">Lista de Precios</h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Precios especiales para clientes autorizados.<br />
                Ingresa tu código de acceso para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="• • • • • • • • • •"
                  className={cn(
                    "h-16 rounded-2xl text-center text-xl font-bold tracking-[0.4em] border-2 transition-all",
                    error
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 focus:border-primary/50 focus:bg-blue-50/30"
                  )}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-red-600 text-sm font-bold">
                  Código incorrecto. Verifica e intenta de nuevo.
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl font-black text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                disabled={!code.trim()}
              >
                Acceder a Lista de Precios
              </Button>
            </form>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-xs text-slate-400 font-medium">¿No tienes código de acceso?</p>
              <a
                href="https://wa.me/528121980008?text=Hola! Me gustaría obtener acceso a la lista de precios de Tornillos AM."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-black text-green-600 hover:text-green-700 transition-colors"
              >
                <span className="text-base">💬</span> Solicitar por WhatsApp
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            La información contenida en esta lista es confidencial.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PRICE TABLE                                                     */
/* ═══════════════════════════════════════════════════════════════ */
function PriceTable() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm]         = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") ?? "");
  const [products, setProducts]             = useState<Product[]>([]);
  const [categories, setCategories]         = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading]               = useState(true);
  const [exporting, setExporting]           = useState(false);
  const [currentPage, setCurrentPage]       = useState(0);
  const [totalCount, setTotalCount]         = useState(0);
  const [showTips, setShowTips]             = useState(true);
  const [hintIdx, setHintIdx]               = useState(0);
  const today = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });

  // Cycle placeholder hints
  useEffect(() => {
    const t = setInterval(() => setHintIdx((i) => (i + 1) % SEARCH_HINTS.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(0); }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch categories
  useEffect(() => {
    supabase.from("categories").select("name").then(({ data }) => {
      if (data) setCategories(data.map((c) => c.name));
    });
  }, []);

  // Server-side fetch
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("products")
        .select("id, name, sku, price, categories(name)", { count: "exact" })
        .not("price", "is", null)
        .gt("price", 0);

      if (debouncedSearch.trim()) {
        query = applySmartSearch(query, debouncedSearch);
      }
      if (selectedCategory !== "all")
        query = query.eq("categories.name", selectedCategory);

      query = query.range(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE - 1)
                   .order("name");

      const { data, count } = await query;
      setProducts((data ?? []).map((p: any) => ({
        id: p.id, name: p.name, sku: p.sku || "—",
        category: p.categories?.name || "Otros", price: p.price,
      })));
      setTotalCount(count ?? 0);
    } finally { setLoading(false); }
  }, [debouncedSearch, selectedCategory, currentPage]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* ── Export Excel (real .xlsx) ── */
  async function downloadExcel() {
    setExporting(true);
    try {
      // Fetch ALL matching products for export (no pagination limit)
      let query = supabase
        .from("products")
        .select("name, sku, price, categories(name)")
        .not("price", "is", null)
        .gt("price", 0)
        .order("name");

      if (debouncedSearch.trim()) {
        query = applySmartSearch(query, debouncedSearch);
      }
      if (selectedCategory !== "all")
        query = query.eq("categories.name", selectedCategory);

      // Supabase max 1000 per request, paginate for full export
      let allData: any[] = [];
      let page = 0;
      while (true) {
        const { data } = await query.range(page * 1000, page * 1000 + 999);
        if (!data || data.length === 0) break;
        allData = [...allData, ...data];
        if (data.length < 1000) break;
        page++;
      }

      const rows = allData.map((p: any) => ({
        "SKU":      p.sku || "—",
        "Descripción": p.name,
        "Categoría":  p.categories?.name || "Otros",
        "Precio Unitario MXN": parseFloat(calcSellPrice(p.price).toFixed(2)),
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      // Column widths
      ws["!cols"] = [{ wch: 16 }, { wch: 50 }, { wch: 18 }, { wch: 22 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Lista de Precios");

      // Add header info sheet
      const infoData = [
        ["TORNILLOS AM SA DE CV"],
        ["Vicente Guerrero 2226, Quince de Mayo, 64450 Monterrey, N.L."],
        ["Tel: +52 (81) 2198-0008 | Email: a.luna@tornillosam.com"],
        [""],
        [`Lista de Precios generada el ${today}`],
        ["Precios en MXN sin IVA. Sujetos a disponibilidad de inventario."],
        ["Esta lista es confidencial y de uso exclusivo del destinatario."],
      ];
      const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
      XLSX.utils.book_append_sheet(wb, wsInfo, "Información");

      XLSX.writeFile(wb, `Lista-Precios-TornillosAM-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally { setExporting(false); }
  }

  /* ── Print PDF ── */
  function printList() { window.print(); }

  return (
    <>
      {/* ── Global print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #price-print-area, #price-print-area * { visibility: visible; }
          #price-print-area { position: fixed; inset: 0; padding: 1.5cm; background: white; }
          .no-print { display: none !important; }
          @page { margin: 1.5cm; size: A4; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th { background: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          th, td { border: 1px solid #e2e8f0; padding: 6px 10px; }
          tr:nth-child(even) td { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="no-print"><Navbar /></div>

        {/* ── Print-only header ── */}
        <div id="print-header" className="hidden">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <strong style={{ fontSize: "16px" }}>TORNILLOS AM SA DE CV</strong><br />
              <span style={{ fontSize: "11px", color: "#64748b" }}>Vicente Guerrero 2226, Quince de Mayo, 64450 Monterrey, N.L.</span>
            </div>
            <div style={{ textAlign: "right", fontSize: "11px", color: "#64748b" }}>
              <strong style={{ fontSize: "13px", color: "#333" }}>LISTA DE PRECIOS</strong><br />
              {today}<br />
              +52 (81) 2198-0008
            </div>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: "8px", padding: "8px 12px", fontSize: "10px", color: "#64748b", marginBottom: "16px" }}>
            <strong>Nota:</strong> Precios en MXN sin IVA. Sujetos a disponibilidad. Vigencia 30 días. Esta lista es confidencial y de uso exclusivo del destinatario.
          </div>
        </div>

        <main className="flex-1">
          {/* ── Header ── */}
          <section className="no-print bg-white border-b border-slate-200">
            <div className="container mx-auto max-w-6xl px-6 py-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Lista de Precios</h1>
                    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-black text-[10px] px-2.5">
                      CONFIDENCIAL
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-sm">
                    {loading ? "Cargando inventario..." : `${totalCount.toLocaleString("es-MX")} productos disponibles · Vigencia: ${today}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadExcel}
                    disabled={exporting}
                    className="rounded-xl gap-2 font-bold border-slate-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all h-10"
                  >
                    {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                    {exporting ? "Exportando..." : "Descargar Excel"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={printList}
                    className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 h-10"
                  >
                    <Printer className="w-4 h-4" /> Imprimir / PDF
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6">

            {/* ── Search box ── */}
            <div className="no-print bg-white rounded-[24px] border border-slate-200 p-5 mb-4 space-y-4 shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`${SEARCH_HINTS[hintIdx]}...`}
                  className="pl-12 h-14 rounded-2xl text-base border-2 border-slate-200 focus:border-primary/50 bg-slate-50 focus:bg-white transition-all pr-12"
                />
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                )}
              </div>

              {/* Quick search chips */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Búsquedas rápidas</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCHES.map((q) => {
                    const isActive = searchTerm.toLowerCase() === q.toLowerCase();
                    return (
                      <button
                        key={q}
                        onClick={() => {
                          setSearchTerm(q);
                          setSelectedCategory("all");
                          setCurrentPage(0);
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                          isActive
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary hover:bg-blue-50/50"
                        )}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category filter */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {["all", ...categories.sort()].map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => { 
                          setSelectedCategory(cat); 
                          setCurrentPage(0);
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                          isActive
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"
                        )}
                      >
                        {cat === "all" ? "Todas" : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tips panel */}
              {showTips && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 relative">
                  <button
                    onClick={() => setShowTips(false)}
                    className="absolute top-3 right-3 text-blue-300 hover:text-blue-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 text-xs text-blue-700">
                      <p className="font-black text-blue-800">Cómo buscar mejor:</p>
                      <ul className="space-y-1 font-medium">
                        <li>• <strong>Por medida:</strong> escribe "1/2 x 2" o "M8x40"</li>
                        <li>• <strong>Por tipo:</strong> "hexagonal", "socket", "pija broca"</li>
                        <li>• <strong>Por material:</strong> "inoxidable", "galvanizado"</li>
                        <li>• <strong>Por SKU:</strong> escribe el número de clave exacto</li>
                        <li>• <strong>Combina términos:</strong> "tornillo hexagonal inox 1/2"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Results count ── */}
            <div className="no-print flex items-center justify-between mb-3 px-1">
              <p className="text-sm font-bold text-slate-500">
                {loading ? "Buscando..." : (
                  searchTerm || selectedCategory !== "all"
                    ? <><span className="text-slate-900">{totalCount.toLocaleString("es-MX")}</span> resultados para "<span className="text-primary">{searchTerm || selectedCategory}</span>"</>
                    : <><span className="text-slate-900">{totalCount.toLocaleString("es-MX")}</span> productos en catálogo</>
                )}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("all"); setCurrentPage(0); }}
                  className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" /> Limpiar
                </button>
              )}
            </div>

            {/* ── Table ── */}
            <div id="price-print-area">
              {/* Print header (inside print area) */}
              <div id="print-header-inner" className="hidden mb-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                  <div>
                    <p className="font-black text-lg">TORNILLOS AM SA DE CV</p>
                    <p className="text-sm text-slate-500">Vicente Guerrero 2226, Quince de Mayo, 64450 Monterrey, N.L.</p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p className="font-black text-slate-900 text-base">LISTA DE PRECIOS</p>
                    <p>{today}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 pb-3 border-b border-slate-100">
                  Precios en MXN sin IVA. Sujetos a disponibilidad. Esta lista es confidencial.
                </p>
              </div>

              <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200">
                      <th className="text-left py-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">SKU / Clave</th>
                      <th className="text-left py-4 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción del Producto</th>
                      <th className="text-left py-4 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell w-36">Categoría</th>
                      <th className="text-right py-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Precio Unit. MXN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-slate-50 animate-pulse">
                          <td className="py-4 px-5"><div className="h-3 bg-slate-100 rounded-full w-24" /></td>
                          <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded-full w-2/3" /></td>
                          <td className="py-4 px-3 hidden md:table-cell"><div className="h-3 bg-slate-100 rounded-full w-20" /></td>
                          <td className="py-4 px-5"><div className="h-3 bg-slate-100 rounded-full w-16 ml-auto" /></td>
                        </tr>
                      ))
                    ) : products.length > 0 ? (
                      products.map((p, idx) => {
                        const sell = calcSellPrice(p.price);
                        return (
                          <tr
                            key={p.id}
                            className={cn(
                              "border-b border-slate-50 hover:bg-blue-50/30 transition-colors group",
                              idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                            )}
                          >
                            <td className="py-3.5 px-5">
                              <span className="font-black text-[11px] text-slate-400 uppercase tracking-wider group-hover:text-primary transition-colors">
                                {p.sku}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-medium text-slate-800 leading-snug">
                              {p.name}
                            </td>
                            <td className="py-3.5 px-3 hidden md:table-cell">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <span className="font-black text-primary text-base">${fmt(sell)}</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-24">
                          <div className="space-y-3">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                              <Search className="w-7 h-7 text-slate-300" />
                            </div>
                            <p className="font-black text-slate-700">Sin resultados para "{searchTerm}"</p>
                            <p className="text-sm text-slate-400 max-w-xs mx-auto">
                              Intenta con otro término. Ej: "hexagonal", "M8", "inox"
                            </p>
                            <Button variant="outline" size="sm" className="rounded-xl mt-2"
                              onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
                              <X className="w-3.5 h-3.5 mr-1" /> Limpiar búsqueda
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && !loading && (
              <div className="no-print flex items-center justify-between mt-4 bg-white rounded-2xl border border-slate-200 px-5 py-4">
                <p className="text-xs text-slate-400 font-medium">
                  Página <strong className="text-slate-700">{currentPage + 1}</strong> de {totalPages}
                  {" · "}{totalCount.toLocaleString("es-MX")} total
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="rounded-xl gap-1 font-bold border-slate-200 h-9">
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </Button>
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="rounded-xl gap-1 font-bold border-slate-200 h-9">
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Company footer info ── */}
            <div className="no-print mt-6 p-5 bg-white rounded-2xl border border-slate-100 text-xs text-slate-400">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>Tornillos AM SA de CV · Vicente Guerrero 2226, Quince de Mayo, 64450 Monterrey, N.L.</p>
                </div>
                <div className="flex gap-5 shrink-0">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +52 (81) 2198-0008</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> a.luna@tornillosam.com</span>
                </div>
              </div>
              <p className="text-center pt-3 mt-3 border-t border-slate-50">
                Precios en MXN sin IVA. Sujetos a disponibilidad. Esta lista es <strong className="text-slate-500">confidencial</strong> y de uso exclusivo del destinatario.
              </p>
            </div>
          </div>
        </main>

        <div className="no-print"><Footer /></div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  EXPORT                                                          */
/* ═══════════════════════════════════════════════════════════════ */
export default function PriceListPage() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem(SESSION_KEY) === "1"
  );
  if (!authenticated) return <PasswordGate onSuccess={() => setAuthenticated(true)} />;
  return <PriceTable />;
}
