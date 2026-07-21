import { Link } from "react-router-dom";
import { useEffect } from "react";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { useCart } from "../lib/cart";
import { formatINR } from "../lib/products";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export function CartPage() {
  const { items, setQty, remove, total, count } = useCart();

  // Scroll to the top of the window automatically when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      {/* Main fade-in */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:px-8 md:py-16 animate-in fade-in duration-700 ease-out">

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-serif text-4xl text-primary md:text-5xl">Your Cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">{count} item{count === 1 ? "" : "s"}</p>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: "150ms" }}>
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-lg">Your cart is empty.</p>
            <Button asChild className="mt-6"><Link to="/shop">Browse the collection</Link></Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map(({ product, qty }, index) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[80px_1fr_auto] gap-4 rounded-xl bg-card p-3 ring-1 ring-border md:grid-cols-[100px_1fr_auto] animate-in fade-in slide-in-from-bottom-4 fill-mode-both transition-all hover:shadow-sm"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <img src={product.image} alt={product.name} className="aspect-4/5 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.category}</p>
                    <h3 className="truncate font-serif text-lg text-primary">{product.name}</h3>
                    <p className="text-sm font-semibold">{formatINR(product.price)}</p>
                    <div className="mt-2 inline-flex items-center rounded-full border border-border">
                      <button className="p-1.5 hover:bg-secondary cursor-pointer transition-colors" onClick={() => setQty(product.id, qty - 1)}><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{qty}</span>
                      <button className="p-1.5 hover:bg-secondary cursor-pointer transition-colors" onClick={() => setQty(product.id, qty + 1)}><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <button onClick={() => remove(product.id)} className="self-start rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive cursor-pointer transition-colors" aria-label="Remove"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <aside
              className="h-fit rounded-2xl bg-card p-6 ring-1 ring-border animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both"
              style={{ animationDelay: `${(items.length + 2) * 100}ms` }}
            >
              <h2 className="font-serif text-2xl text-primary">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(total)}</dd></div>
                <div className="flex justify-between text-muted-foreground"><dt>Shipping</dt><dd>Free</dd></div>
                <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
              </dl>
              <Button asChild size="lg" className="mt-6 w-full shadow-(--shadow-luxe) transition-transform active:scale-95">
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Cash on Delivery available</p>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}