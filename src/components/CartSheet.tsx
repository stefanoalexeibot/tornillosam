import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalItems, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger 
        render={
          <Button variant="outline" size="icon" className="relative h-10 w-10 border-slate-200">
            <ShoppingCart className="h-5 w-5 text-slate-600" />
            {totalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 flex items-center justify-center bg-primary text-white border-white">
                {totalItems()}
              </Badge>
            )}
          </Button>
        }
      />
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Lista de Cotización
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-slate-300" />
            </div>
            <p className="font-medium text-slate-500">Tu lista está vacía</p>
            <p className="text-sm">Agrega productos para cotizar</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                          <span className="text-xs text-slate-500">{item.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-sm border"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center font-medium text-sm">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-sm border"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="pt-6 border-t border-slate-100 bg-white pb-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 text-sm">Total de partidas</span>
                <span className="font-bold text-slate-900">{items.length}</span>
              </div>
              <div className="space-y-3">
                <Button className="w-full h-12 font-bold" onClick={() => alert("Próximamente: Integración con n8n")}>
                  Solicitar Cotización Formal
                </Button>
                <Button variant="ghost" className="w-full text-slate-400" onClick={clearCart}>
                  Limpiar lista
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
