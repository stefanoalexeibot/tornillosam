import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalItems, clearCart } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={
        <Button variant="outline" size="icon" className="relative h-10 w-10 border-slate-200">
          <ShoppingCart className="h-5 w-5 text-slate-600" />
          {totalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 flex items-center justify-center bg-primary text-white border-white">
              {totalItems()}
            </Badge>
          )}
        </Button>
      } />
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-slate-100 flex-row items-center gap-4 space-y-0">
          {isCheckout && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsCheckout(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <SheetTitle className="flex items-center gap-2 text-xl font-black italic tracking-tighter">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {isCheckout ? "Finalizar Solicitud" : "Lista de Cotización"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-6">
          {!isCheckout ? (
            items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <ShoppingCart className="h-10 w-10 text-slate-200" />
                </div>
                <p className="font-bold text-slate-900">Tu lista está vacía</p>
                <p className="text-sm">Agrega productos para cotizar</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100 uppercase">
                    <TableHead className="text-[10px] font-black text-slate-400 tracking-widest">Producto</TableHead>
                    <TableHead className="text-center text-[10px] font-black text-slate-400 tracking-widest">Cant.</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{item.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-1 bg-slate-100/50 rounded-xl p-1 border border-slate-100 max-w-[100px] mx-auto">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-lg hover:bg-white hover:text-primary transition-all"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center font-bold text-xs text-slate-900">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-lg hover:bg-white hover:text-primary transition-all"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : (
            <CheckoutForm onSuccess={() => {
              setIsCheckout(false);
              setIsOpen(false);
            }} />
          )}
        </div>

        {!isCheckout && items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total de piezas</span>
              <span className="font-black text-slate-900 text-lg">{items.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
            </div>
            <div className="space-y-3">
              <Button 
                className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                onClick={() => setIsCheckout(true)}
              >
                Solicitar Cotización Formal
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-slate-400 font-bold text-sm hover:text-red-500 hover:bg-transparent"
                onClick={clearCart}
              >
                Limpiar lista
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
