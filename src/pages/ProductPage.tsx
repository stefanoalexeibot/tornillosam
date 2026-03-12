import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Package,
  Layers,
  Tag,
  Wrench,
  Loader2,
  Share2,
  ChevronRight,
} from "lucide-react";

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

// Category-based images for visual richness
const categoryImages: Record<string, string> = {
  "Tornillería": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800",
  "Tuercas": "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800",
  "Birlos": "https://images.unsplash.com/photo-1606206873764-fd15e242a4d8?auto=format&fit=crop&q=80&w=800",
  "Pijas": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
  "Arandelas": "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
  "Varillas": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
  "Automotriz": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800",
  "Soportería": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
  "default": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800",
};

// Derive technical features from product attributes
function getFeatures(product: Product): string[] {
  const features = [];
  if (product.material) features.push(`Material: ${product.material}`);
  if (product.grade) features.push(`Grado / Norma: ${product.grade}`);
  if (product.finish) features.push(`Acabado: ${product.finish}`);
  features.push("Disponible en stock inmediato");
  features.push("Compatible con herramientas estándar");
  return features;
}

function getApplications(category: string): string[] {
  const apps: Record<string, string[]> = {
    "Tornillería": ["Construcción estructural", "Fabricación metálica", "Proyectos industriales", "Ensambles mecánicos"],
    "Tuercas": ["Uniones estructurales", "Maquinaria industrial", "Instalaciones metálicas"],
    "Birlos": ["Sector automotriz", "Maquinaria pesada", "Ensambles de alta resistencia"],
    "Pijas": ["Fijación de láminas", "Armado de estructuras ligeras", "Herrería"],
    "Arandelas": ["Distribución de carga", "Protección de superficies", "Juntas selladas"],
    "Varillas": ["Anclajes en concreto", "Tensores estructurales", "Soportes roscados"],
    "Automotriz": ["Carrocería automotriz", "Paneles interiores", "Seguros de clips"],
  };
  return apps[category] ?? ["Industrial general", "Proyectos de construcción", "Fabricación metálica"];
}

function getBenefits(product: Product): string[] {
  const benefits = [];
  if (product.material?.toLowerCase().includes("inox")) {
    benefits.push("Alta resistencia a la corrosión y oxidación");
  } else if (product.finish?.toLowerCase().includes("zinc") || product.finish?.toLowerCase().includes("galv")) {
    benefits.push("Recubrimiento de zinc para mayor durabilidad");
  }
  if (product.grade?.includes("Grado 8") || product.grade?.includes("A2") || product.grade?.includes("10.9")) {
    benefits.push("Alta resistencia a tracción para aplicaciones críticas");
  }
  benefits.push("Compatibilidad con herramientas estándar de torque");
  benefits.push("Cumple normas internacionales de calidad (DIN/ISO/ASTM)");
  benefits.push("Stock disponible para entrega inmediata en Monterrey");
  return benefits;
}

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      if (!sku) return;
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("sku", sku)
        .single();

      if (data) {
        setProduct(data);
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category", data.category)
          .neq("sku", sku)
          .limit(4);
        setRelatedProducts(related ?? []);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [sku]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const message = `Hola Tornillos AM! Me interesa cotizar: *${product.name}* (SKU: ${product.sku}). Cantidad: ${quantity} piezas.`;
    window.open(`https://wa.me/528121980008?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-slate-400 font-medium">Cargando producto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
              <Package className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Producto no encontrado</h2>
            <p className="text-slate-500">El SKU <strong>{sku}</strong> no existe en nuestro catálogo.</p>
            <Button onClick={() => navigate("/catalogo")} className="rounded-xl">
              Ver Catálogo Completo
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImage = categoryImages[product.category] ?? categoryImages["default"];
  const features = getFeatures(product);
  const applications = getApplications(product.category);
  const benefits = getBenefits(product);
  const displayPrice = product.price ? (product.price * 0.5) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="container mx-auto flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/catalogo?cat=${product.category}`)}>
            {product.category}
          </span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-10 max-w-6xl">
          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Button variant="ghost" size="sm" className="mb-6 gap-2 rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
          </motion.div>

          {/* Main Product Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 aspect-square bg-white">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white border-none font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                    ✓ En Stock
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 border-none font-black text-xs px-3 py-1 rounded-xl shadow-lg">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                  {product.category}
                </p>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  SKU: {product.sku}
                </p>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { icon: Layers, label: "Material", value: product.material },
                    { icon: Tag, label: "Grado", value: product.grade },
                    { icon: Wrench, label: "Acabado", value: product.finish },
                    { icon: Package, label: "Categoría", value: product.category },
                  ].map((spec, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <spec.icon className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                      </div>
                      <p className="font-black text-slate-900 text-sm leading-tight">{spec.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              {displayPrice && (
                <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10">
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">Precio Unitario Est.</p>
                  <p className="text-4xl font-black text-slate-900">
                    ${displayPrice.toFixed(2)} <span className="text-sm text-slate-400 font-bold">MXN</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">* Precio referencial. Confirmar con ventas.</p>
                </div>
              )}

              {/* Quantity + CTA */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-white rounded-2xl p-1 border border-slate-100 shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:text-primary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-black text-slate-900 text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:text-primary"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">pieza{quantity > 1 ? "s" : ""}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    className={`flex-1 h-14 rounded-2xl font-black text-base gap-2 shadow-xl shadow-primary/20 transition-all duration-300 ${added ? "bg-green-500 shadow-green-500/20" : ""}`}
                    onClick={handleAddToCart}
                  >
                    {added ? (
                      <><CheckCircle2 className="w-5 h-5" /> Agregado</>
                    ) : (
                      <><ShoppingCart className="w-5 h-5" /> Agregar a Cotización</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-14 rounded-2xl font-black text-base gap-2 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="w-5 h-5" />
                  Cotizar por WhatsApp
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Technical Specifications Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {/* Features */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
                <span className="text-xl">🔩</span> Características
              </h3>
              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-primary mt-0.5 font-black">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
                <span className="text-xl">🏗️</span> Aplicaciones
              </h3>
              <ul className="space-y-3">
                {applications.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-primary mt-0.5 font-black">✓</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
                <span className="text-xl">✅</span> Beneficios
              </h3>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-green-500 mt-0.5 font-black">→</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Misma categoría</p>
                  <h2 className="text-2xl font-black text-slate-900">Productos Relacionados</h2>
                </div>
                <Link to={`/catalogo`}>
                  <Button variant="ghost" className="font-black text-primary gap-1 hover:bg-primary/5 rounded-xl">
                    Ver todos <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p, i) => (
                  <motion.div key={p.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                    <Link to={`/producto/${p.sku}`}>
                      <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer">
                        <div className="w-full h-28 rounded-2xl overflow-hidden mb-4 bg-slate-50">
                          <img
                            src={categoryImages[p.category] ?? categoryImages["default"]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <p className="font-black text-slate-900 text-sm leading-tight mb-1 group-hover:text-primary transition-colors">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{p.sku}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
