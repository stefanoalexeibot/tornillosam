import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  const phoneNumber = "528112345678"; // Replace with actual number
  const message = "Hola! Vengo desde el sitio web de Tornillos AM y me gustaría solicitar información técnica.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] group"
    >
      <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/40 transition-all duration-500 scale-0 group-hover:scale-100"></div>
      <Button 
        size="icon" 
        className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl shadow-green-500/20 relative animate-in fade-in slide-in-from-bottom-8 duration-1000"
      >
        <MessageCircle className="h-8 w-8" />
        <span className="absolute right-full mr-4 bg-white text-slate-900 border border-slate-100 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Dudas técnicas? Chatea con nosotros
        </span>
      </Button>
    </a>
  );
}
