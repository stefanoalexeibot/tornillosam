import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Package,
  ChevronRight,
  ChevronLeft,
  Inbox,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  material: string;
  grade: string;
  finish: string;
  sku: string;
  price?: number;
  currency?: string;
}

const PAGE_SIZE = 24;

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") ?? "");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { addItem } = useCart();

  // Debounce the search input (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(0); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync URL param
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchTerm(q);
      setDebouncedSearch(q);
    }
  }, [searchParams]);

  // Fetch categories and materials once
  useEffect(() => {
    async function fetchMeta() {
      const { data: catData } = await supabase.from("categories").select("name");
      if (catData) setCategories(catData.map((c) => c.name));

      const { data: matData } = await supabase
        .from("products")
        .select("material")
        .not("material", "is", null)
        .limit(500);
      if (matData) {
        const unique = Array.from(new Set(matData.map((p: any) => p.material))).filter(Boolean) as string[];
        setMaterials(unique.sort());
      }
    }
    fetchMeta();
  }, []);

  // Server-side search + filter + paginate
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("products")
        .select("*, categories(name)", { count: "exact" });

      // Search filter
      if (debouncedSearch.trim()) {
        query = query.or(
          `name.ilike.%${debouncedSearch}%,sku.ilike.%${debouncedSearch}%`
        );
      }

      // Category filter
      if (selectedCategory !== "all") {
        // Join-based filter needs a subquery — filter by category name via the join
        query = query.eq("categories.name", selectedCategory);
      }

      // Material filter
      if (selectedMaterial !== "all") {
        query = query.ilike("material", selectedMaterial);
      }

      // Pagination
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to).order("name", { ascending: true });

      const { data, count, error } = await query;
      if (error) throw error;

      const mapped = (data ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name || "Otros",
        material: p.material || "N/A",
        grade: p.grade || "N/A",
        finish: p.finish || "N/A",
        sku: p.sku || "N/A",
        price: p.price,
        currency: p.currency || "MXN",
      }));

      setProducts(mapped);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedMaterial, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Banner Superior */}
        <section className="bg-white border-b border-slate-200 py-8 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Buscador de Refacciones
                </h1>
                <p className="text-slate-500 text-sm">
                  {loading
                    ? "Buscando en inventario..."
                    : `${totalCount.toLocaleString("es-MX")} resultado${totalCount !== 1 ? "s" : ""} encontrado${totalCount !== 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="relative w-full md:w-[480px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Busca por nombre o SKU (ej: tornillo hexagonal grado 5)..."
                  className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl text-base shadow-sm focus:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Category Pills */}
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => { setSelectedCategory("all"); setCurrentPage(0); }}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all",
                selectedCategory === "all" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              Todas
            </button>
            {categories.sort().map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(0); }}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap",
                  selectedCategory === cat ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 text-lg">Filtros</h3>
                <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Material</span>
                <Select value={selectedMaterial} onValueChange={(val) => { setSelectedMaterial(val || "all"); setCurrentPage(0); }}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl h-12">
                    <SelectValue placeholder="Cualquier material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cualquier material</SelectItem>
                    {materials.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full rounded-xl h-12 font-black" onClick={() => setShowMobileFilters(false)}>
                Ver resultados
              </Button>
            </div>
          </div>
        )}

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                Categorías
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory("all"); setCurrentPage(0); }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                    selectedCategory === "all"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-600 hover:bg-white hover:text-primary"
                  )}
                >
                  Todas las piezas
                  <ChevronRight className={cn("w-4 h-4", selectedCategory === "all" ? "opacity-100" : "opacity-0")} />
                </button>
                {categories.sort().map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(0); }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                      selectedCategory === cat
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-slate-600 hover:bg-white hover:text-primary"
                    )}
                  >
                    {cat}
                    <ChevronRight className={cn("w-4 h-4", selectedCategory === cat ? "opacity-100" : "opacity-0")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                Material
              </h3>
              <div className="bg-white p-4 rounded-3xl border border-slate-100 space-y-2">
                <Select value={selectedMaterial} onValueChange={(val) => { setSelectedMaterial(val || "all"); setCurrentPage(0); }}>
                  <SelectTrigger className="bg-slate-50 border-slate-100">
                    <SelectValue placeholder="Cualquier material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cualquier material</SelectItem>
                    {materials.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(selectedCategory !== "all" || selectedMaterial !== "all") && (
                  <button
                    onClick={() => { setSelectedCategory("all"); setSelectedMaterial("all"); setCurrentPage(0); }}
                    className="text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 mt-2 w-full justify-center"
                  >
                    <X className="w-3 h-3" /> Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-5">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white px-4 sm:px-5 py-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-600">
                  {loading ? "Buscando..." : `${totalCount.toLocaleString("es-MX")} resultados`}
                </span>
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold hidden sm:flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => { setSelectedCategory("all"); setCurrentPage(0); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden gap-1.5 rounded-xl border-slate-200 font-bold text-xs"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filtros
                {selectedMaterial !== "all" && <span className="w-2 h-2 rounded-full bg-primary" />}
              </Button>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 h-64 animate-pulse">
                    <div className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                      <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                      <div className="h-3 bg-slate-50 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:border-primary/40 border-slate-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 cursor-pointer bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-5 pb-2">
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                            <Package className="w-5 h-5" />
                          </div>
                          <p className="text-[10px] font-black text-slate-300 tracking-tighter uppercase">{product.sku}</p>
                        </div>

                        <Link to={`/producto/${product.sku}`} className="block">
                          <h3 className="font-extrabold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 text-sm min-h-[2.6rem]">
                            {product.name}
                          </h3>
                        </Link>
                        <Link to={`/producto/${product.sku}`} className="text-[10px] font-black text-primary/60 hover:text-primary flex items-center gap-0.5 transition-colors mt-1">
                          Ver ficha técnica <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="px-5 py-3 border-y border-slate-50 space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-medium">Categoría</span>
                          <span className="font-black text-slate-700">{product.category}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-medium">Material</span>
                          <span className="font-black text-slate-700">{product.material}</span>
                        </div>
                      </div>

                      <div className="p-5 pt-3">
                        <div className="mb-3">
                          {product.price && product.price > 0 ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-primary">
                                ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">{product.currency}</span>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 italic">
                              Bajo Cotización
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full font-black h-11 rounded-2xl gap-2 active:scale-95 transition-transform"
                          onClick={() => addItem(product, 1)}
                        >
                          <Plus className="w-4 h-4" /> Añadir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-28 bg-white rounded-[40px] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Inbox className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Sin resultados</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  No encontramos "{searchTerm}". Prueba con otro nombre o medida.
                </p>
                <Button
                  variant="link"
                  className="mt-4 text-primary font-bold"
                  onClick={() => { setSearchTerm(""); setSelectedCategory("all"); setSelectedMaterial("all"); setCurrentPage(0); }}
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-slate-200">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="rounded-xl gap-1 font-bold border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
                    let page = i;
                    if (totalPages > 7) {
                      if (currentPage <= 3) page = i;
                      else if (currentPage >= totalPages - 4) page = totalPages - 7 + i;
                      else page = currentPage - 3 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "w-9 h-9 rounded-xl text-sm font-black transition-all",
                          page === currentPage
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        {page + 1}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="rounded-xl gap-1 font-bold border-slate-200"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
