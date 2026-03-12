import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, Package } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem } = useCart();

  const filteredProducts = MOCK_PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Seccion */}
        <section className="bg-white border-b border-slate-100 py-12 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
                  Catálogo Digital
                </Badge>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  Explora +8,000 Refacciones
                </h1>
                <p className="text-slate-500 max-w-lg">
                  Encuentra exactamente lo que necesitas por medida, grado o material.
                </p>
              </div>
              
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Buscar por SKU, nombre o medida..." 
                  className="pl-10 h-12 bg-slate-50 border-slate-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Listado de Productos */}
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Filter className="w-4 h-4" />
                <span>Mostrando {filteredProducts.length} resultados</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:border-primary/40 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Package className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <h3 className="font-extrabold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 font-mono">{product.sku}</p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Material</span>
                          <span className="font-bold text-slate-700">{product.material}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Grado</span>
                          <span className="font-bold text-slate-700">{product.grade}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Acabado</span>
                          <span className="font-bold text-slate-700">{product.finish}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full font-bold h-10 gap-2"
                        onClick={() => addItem(product, 1)}
                      >
                        <Plus className="w-4 h-4" />
                        Añadir a Cotización
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No encontramos resultados</h3>
                <p className="text-slate-500">Intenta buscando con otros términos o medidas.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
