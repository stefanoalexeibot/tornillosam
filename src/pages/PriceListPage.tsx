import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Lock,
  FileDown,
  Printer,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Configuración ───────────────────────────────────────────────── */
const ACCESS_CODE = import.meta.env.VITE_PRICELIST_CODE ?? "tornillos2024";
// El script de importación almacenó: price_en_db = $ LISTA / 2
// Por lo tanto: $ LISTA real = price_en_db × 2
// Costo neto (76.5% dto) = LISTA × 0.235 = price_en_db × 2 × 0.235
// Precio venta (×1.70)   = Costo × 1.70  = price_en_db × 0.799  ← neto final
const MARKUP_FACTOR = 2 * (1 - 0.765) * 1.70; // = 0.7990
const PAGE_SIZE = 50;
const SESSION_KEY = "pricelist_auth";

/* ─── Cálculo de precio ───────────────────────────────────────────── */
function calcSellPrice(dbPrice: number): number {
  // dbPrice = $ LISTA / 2  →  precio cliente = dbPrice × 0.799
  return dbPrice * MARKUP_FACTOR;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
}

/* ─────────────────────────────────────────────────────────────────── */
/*  PASSWORD GATE                                                       */
/* ─────────────────────────────────────────────────────────────────── */
function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [showCode, setShowCode] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === ACCESS_CODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setError(true);
      setCode("");
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl shadow-slate-200/60 text-center space-y-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900">Lista de Precios</h1>
              <p className="text-sm text-slate-500 font-medium">
                Acceso exclusivo para clientes autorizados.<br />
                Ingresa tu código de acceso.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showCode ? "text" : "password"}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código de acceso"
                  className={cn(
                    "h-14 rounded-2xl text-center text-lg font-bold tracking-widest border-2 transition-all",
                    error
                      ? "border-red-400 bg-red-50 animate-pulse"
                      : "border-slate-200 focus:border-primary/50"
                  )}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm font-bold">Código incorrecto. Intenta de nuevo.</p>
              )}
              <Button
                type="submit"
                className="w-full h-13 rounded-2xl font-black text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all"
                disabled={!code.trim()}
              >
                Acceder a Lista
              </Button>
            </form>
            <p className="text-xs text-slate-400">
              ¿No tienes código?{" "}
              <a href="https://wa.me/528121980008" target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">
                Contáctanos por WhatsApp
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  PRICE LIST TABLE                                                    */
/* ─────────────────────────────────────────────────────────────────── */
function PriceTable() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") ?? "");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });

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

  // Fetch products server-side
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("products")
        .select("id, name, sku, price, categories(name)", { count: "exact" })
        .not("price", "is", null)
        .gt("price", 0);

      if (debouncedSearch.trim()) {
        query = query.or(`name.ilike.%${debouncedSearch}%,sku.ilike.%${debouncedSearch}%`);
      }
      if (selectedCategory !== "all") {
        query = query.eq("categories.name", selectedCategory);
      }

      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to).order("name", { ascending: true });

      const { data, count } = await query;
      setProducts(
        (data ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || "—",
          category: p.categories?.name || "Otros",
          price: p.price,
        }))
      );
      setTotalCount(count ?? 0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, currentPage]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* ── CSV Export ── */
  function downloadCSV() {
    const rows = [
      ["SKU", "Nombre", "Categoría", "Precio Unitario (MXN)"],
      ...products.map((p) => [
        p.sku,
        `"${p.name}"`,
        p.category,
        calcSellPrice(p.price).toFixed(2),
      ]),
    ];
    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Lista-Precios-TornillosAM-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /* ── Print PDF ── */
  function printList() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Print Header (only visible when printing) */}
      <div className="hidden print:block p-8 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <span className="font-black text-lg text-slate-900">TORNILLOS AM SA DE CV</span>
            </div>
            <p className="text-sm text-slate-500">Vicente Guerrero 2226, Quince de Mayo, 64450 Monterrey, N.L.</p>
          </div>
          <div className="text-right text-sm text-slate-500 space-y-1">
            <p className="font-black text-slate-900">LISTA DE PRECIOS</p>
            <p>{today}</p>
            <p>+52 (81) 2198-0008</p>
            <p>a.luna@tornillosam.com</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-200">
          <strong>Nota:</strong> Precios en MXN. Sujetos a disponibilidad de inventario. Vigencia 30 días.
          Consulte condiciones de pago y entrega con su ejecutivo de cuenta.
        </div>
      </div>

      <main className="flex-1 flex flex-col print:bg-white">
        {/* Header bar */}
        <section className="bg-white border-b border-slate-200 py-6 px-6 print:hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  <h1 className="text-2xl font-black text-slate-900">Lista de Precios</h1>
                  <Badge className="bg-primary/10 text-primary border-none font-black text-xs">Confidencial</Badge>
                </div>
                <p className="text-slate-500 text-sm">
                  {loading ? "Cargando..." : `${totalCount.toLocaleString("es-MX")} productos · Vigencia: ${today}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadCSV}
                  className="rounded-xl gap-2 font-bold border-slate-200 hover:border-primary hover:text-primary"
                >
                  <FileDown className="w-4 h-4" /> Descargar Excel
                </Button>
                <Button
                  size="sm"
                  onClick={printList}
                  className="rounded-xl gap-2 font-bold shadow-md shadow-primary/20"
                >
                  <Printer className="w-4 h-4" /> Imprimir / PDF
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 print:px-0 print:py-2">
          {/* Filters - hidden when printing */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5 print:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Busca por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200 bg-white"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["all", ...categories.sort()].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(0); }}
                  className={cn(
                    "flex-shrink-0 px-3 py-2 rounded-xl text-xs font-black transition-all",
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-primary/40"
                  )}
                >
                  {cat === "all" ? "Todos" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div ref={printRef} className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm print:rounded-none print:shadow-none print:border-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">SKU</th>
                  <th className="text-left py-4 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                  <th className="text-left py-4 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell w-36">Categoría</th>
                  <th className="text-right py-4 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-36">Precio Unit. MXN</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-50 animate-pulse">
                      <td className="py-4 px-5"><div className="h-3 bg-slate-100 rounded w-20" /></td>
                      <td className="py-4 px-3"><div className="h-3 bg-slate-100 rounded w-48" /></td>
                      <td className="py-4 px-3 hidden sm:table-cell"><div className="h-3 bg-slate-100 rounded w-24" /></td>
                      <td className="py-4 px-5"><div className="h-3 bg-slate-100 rounded w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : products.length > 0 ? (
                  products.map((product, idx) => {
                    const sellPrice = calcSellPrice(product.price);
                    return (
                      <tr
                        key={product.id}
                        className={cn(
                          "border-b border-slate-50 hover:bg-slate-50/70 transition-colors",
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                        )}
                      >
                        <td className="py-3.5 px-5 font-black text-[11px] text-slate-400 uppercase tracking-wider">
                          {product.sku}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800 leading-snug">
                          {product.name}
                        </td>
                        <td className="py-3.5 px-3 hidden sm:table-cell">
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-black text-primary text-base">
                          ${sellPrice.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-20 text-slate-400">
                      <div className="space-y-2">
                        <p className="font-black text-slate-500">Sin resultados</p>
                        <p className="text-sm">Prueba con otro nombre o SKU</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-between mt-4 print:hidden">
              <p className="text-xs text-slate-400 font-medium">
                Página {currentPage + 1} de {totalPages} · {totalCount.toLocaleString("es-MX")} productos
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="rounded-xl gap-1 font-bold border-slate-200 h-9"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-xl gap-1 font-bold border-slate-200 h-9"
                >
                  Siguiente <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-100 text-xs text-slate-400 space-y-2 print:mt-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>Tornillos AM SA de CV · Vicente Guerrero 2226, Quince de Mayo, 64450 Monterrey, N.L.</p>
              </div>
              <div className="flex gap-4 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>+52 (81) 2198-0008</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>a.luna@tornillosam.com</span>
                </div>
              </div>
            </div>
            <p className="text-center pt-1 border-t border-slate-50">
              <strong className="text-slate-500">Nota:</strong> Precios en MXN sin IVA. Sujetos a disponibilidad. Esta lista es confidencial y de uso exclusivo del destinatario.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          nav, footer { display: none !important; }
          body { background: white !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  MAIN EXPORT                                                         */
/* ─────────────────────────────────────────────────────────────────── */
export default function PriceListPage() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem(SESSION_KEY) === "1"
  );

  if (!authenticated) {
    return <PasswordGate onSuccess={() => setAuthenticated(true)} />;
  }

  return <PriceTable />;
}
