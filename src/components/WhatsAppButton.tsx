import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const WhatsAppButton: React.FC = () => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const phone = '528121980008';

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getWhatsAppUrl = () => {
    let message = 'Hola! Vengo desde el sitio web y me gustaría solicitar información.';
    
    if (location.pathname.includes('/catalogo')) {
      message = 'Hola! Estoy viendo el catálogo de Tornillos AM y me gustaría cotizar algunos productos.';
    } else if (location.pathname.includes('/lista-precios')) {
      message = 'Hola! Estoy revisando la lista de precios y tengo una consulta sobre un pedido.';
    } else if (location.pathname.includes('/producto/')) {
      const sku = location.pathname.split('/').pop();
      message = `Hola! Me interesa el producto con SKU ${sku} que vi en su sitio web.`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group",
        show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
      
      {/* Tooltip o Mensaje de Atención */}
      <span className="absolute right-full mr-4 bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100">
        ¿Te ayudamos con tu pedido? 📲
      </span>

      {/* Onda de animación sutil */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
    </a>
  );
};
