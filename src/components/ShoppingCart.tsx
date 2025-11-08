import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  title: string;
  price: number;
  category: string;
}

interface ShoppingCartProps {
  cart: CartItem[];
  onRemoveFromCart: (id: number) => void;
  onClearCart: () => void;
}

export default function ShoppingCart({ cart, onRemoveFromCart, onClearCart }: ShoppingCartProps) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const itemCount = cart.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Icon name="ShoppingCart" size={20} />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl">Корзина</SheetTitle>
          <SheetDescription>
            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'композиция' : 'композиций'} в корзине` : 'Корзина пуста'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="ShoppingBag" size={64} className="mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">Добавьте композиции для покупки</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                      <p className="text-accent font-semibold mt-2">{item.price} ₽</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="shrink-0"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого:</span>
                  <span className="text-accent">{totalPrice} ₽</span>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={onClearCart} className="flex-1">
              <Icon name="Trash2" size={16} className="mr-2" />
              Очистить
            </Button>
            <Button className="flex-1">
              <Icon name="CreditCard" size={16} className="mr-2" />
              Оформить
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
