import { useState, useEffect } from "react";
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
  Inbox,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal
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

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addItem } = useCart();

  // Sync URL param on first load
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch Categories
        const { data: catData } = await supabase.from('categories').select('name');
        if (catData) setCategories(catData.map(c => c.name));

        // Fetch Products
        const { data: prodData, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (name)
          `);
        
        if (error) throw error;
        
        if (prodData) {
          const mapped = prodData.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.categories?.name || 'Otros',
            material: p.material || 'N/A',
            grade: p.grade || 'N/A',
            finish: p.finish || 'N/A',
            sku: p.sku || 'N/A',
            price: p.price,
            currency: p.currency || 'MXN'
          }));
          setProducts(mapped);
          
          // Extract unique materials
          const uniqueMats = Array.from(new Set(mapped.map(p => p.material))).filter(m => m !== 'N/A');
          setMaterials(uniqueMats);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesMaterial = selectedMaterial === "all" || product.material === selectedMaterial;
    
    return matchesSearch && matchesCategory && matchesMaterial;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Banner Superior - Buscador Principal */}
        <section className="bg-white border-b border-slate-200 py-10 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Buscador de Refacciones
                </h1>
                <p className="text-slate-500 text-sm">
                  Explora nuestro inventario de +13,000 SKUs con precios actualizados.
                </p>
              </div>
              
              <div className="relative w-full md:w-[450px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Busca por nombre o SKU (ej: 10100)..." 
                  className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl text-lg shadow-sm focus:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Category Pills - visible only on mobile */}
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all",
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              Todas
            </button>
            {categories.sort().map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Modal */}
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
                <Select value={selectedMaterial} onValueChange={(val) => setSelectedMaterial(val || "all")}>
                  <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl h-12">
                    <SelectValue placeholder="Cualquier material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Cualquier material</SelectItem>
                    {materials.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full rounded-xl h-12 font-black" onClick={() => setShowMobileFilters(false)}>
                Ver {filteredProducts.length} resultados
              </Button>
            </div>
          </div>
        )}

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8">
          {/* Sidebar de Filtros - Desktop */}
          <aside className="hidden md:block w-72 flex-shrink-0 space-y-8">
            {/* Categorías (Secciones) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest pl-2">
                Secciones
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
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
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
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

            {/* Filtros Adicionales */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest pl-2">
                Propiedades
              </h3>
              <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400">Material</span>
                  <Select value={selectedMaterial} onValueChange={(val) => setSelectedMaterial(val || "all")}>
                    <SelectTrigger className="bg-slate-50 border-slate-100">
                      <SelectValue placeholder="Cualquier material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Cualquier material</SelectItem>
                      {materials.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Contenido Principal */}
          <div className="flex-1 space-y-6">
            {/* Toolbar de resultados */}
            <div className="flex items-center justify-between bg-white px-4 sm:px-6 py-4 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {loading ? 'Sincronizando...' : `${filteredProducts.length} Resultados`}
                  </span>
                </div>
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold hidden sm:flex items-center">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")} className="ml-2 hover:text-red-500">×</button>
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden gap-2 rounded-xl border-slate-200 font-bold text-xs"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filtros
                  {selectedMaterial !== "all" && <span className="w-2 h-2 rounded-full bg-primary" />}
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-400 hover:text-primary">
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-200">
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Grid de Productos */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 h-72 animate-pulse">
                    <div className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                      <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                      <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.slice(0, 100).map((product) => (
                  <Card key={product.id} className="group hover:border-primary/40 border-slate-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 cursor-pointer bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header Card con Icono y SKU */}
                      <div className="p-6 pb-2">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                            <Package className="w-6 h-6" />
                          </div>
                          <p className="text-[10px] font-black text-slate-300 tracking-tighter uppercase">{product.sku}</p>
                        </div>
                        
                         <Link to={`/producto/${product.sku}`} className="block">
                          <h3 className="font-extrabold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <Link to={`/producto/${product.sku}`} className="text-[10px] font-black text-primary/60 hover:text-primary flex items-center gap-0.5 transition-colors">
                            Ver ficha técnica <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Detalles Tecnicos */}
                      <div className="px-6 py-4 border-y border-slate-50 space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-medium">Categoría</span>
                          <span className="font-black text-slate-700">{product.category}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 font-medium">Material</span>
                          <span className="font-black text-slate-700">{product.material}</span>
                        </div>
                      </div>

                      {/* Precio y Accion */}
                      <div className="p-6 pt-4">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            {product.price && product.price > 0 ? (
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-primary">
                                  ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                  {product.currency}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 italic">
                                Bajo Cotización
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full font-black h-12 rounded-2xl gap-2 active:scale-95 transition-transform"
                          onClick={() => addItem(product, 1)}
                        >
                          <Plus className="w-5 h-5" />
                          Añadir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Inbox className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No se encontraron piezas</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Prueba buscando por una medida diferente o ajustando los filtros laterales.
                </p>
                <Button 
                  variant="link" 
                  className="mt-6 text-primary font-bold"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedMaterial("all");
                  }}
                >
                  Limpiar todos los filtros
                </Button>
              </div>
            )}
            
            {filteredProducts.length > 100 && !loading && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-xs font-medium">
                  Se muestran los primeros 100 resultados de {filteredProducts.length}. 
                  Especifique más su búsqueda para encontrar piezas exactas.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
