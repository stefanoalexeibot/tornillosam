import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

interface CheckoutFormProps {
  onSuccess: () => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      customer: formData,
      items: items.map(item => ({
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      timestamp: new Date().toISOString()
    };

    try {
      // n8n Webhook Integration
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n.example.com/webhook/tornillos-am";
      
      // We simulate the call if the URL is not configured
      if (!import.meta.env.VITE_N8N_WEBHOOK_URL) {
        console.log("Simulating webhook send:", payload);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      setSuccess(true);
      setTimeout(() => {
        clearCart();
        onSuccess();
      }, 3000);
    } catch (error) {
      console.error("Error sending quote:", error);
      alert("Hubo un error al enviar tu solicitud. Por favor intenta de nuevo o contáctanos por WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-4">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">¡Solicitud Enviada!</h3>
        <p className="text-slate-500 max-w-xs">
          Hemos recibido tu lista. Un asesor de Tornillos AM te contactará en breve con tu cotización formal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">Detalles de la Cotización</h2>
        <p className="text-slate-400 text-sm">Completa tus datos para procesar tu solicitud formal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo *</label>
          <Input 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Ej. Pedro Garz" 
            className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary/20" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Teléfono *</label>
          <Input 
            required
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            placeholder="81 1234 5678" 
            className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary/20" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico *</label>
        <Input 
          required
          type="email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          placeholder="p.garza@empresa.com" 
          className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary/20" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Empresa (Opcional)</label>
        <Input 
          value={formData.company}
          onChange={e => setFormData({...formData, company: e.target.value})}
          placeholder="Nombre de tu negocio" 
          className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary/20" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notas Adicionales</label>
        <textarea 
          className="w-full min-h-[100px] bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="Ej. Requiero envío a Santa Catarina o factura..."
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
        ></textarea>
      </div>

      <Button 
        disabled={loading || items.length === 0} 
        className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20 group"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            Enviar Cotización <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}
