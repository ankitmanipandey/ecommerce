import { Link, useNavigate, useParams } from "react-router-dom";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { findProduct, formatINR } from "../lib/products";
import { useCart } from "../lib/cart";
import { toast } from "sonner";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export function ProductDetail() {
    const { id } = useParams();
    const product = findProduct(id);
    const { add } = useCart();
    const navigate = useNavigate();

    if (!product) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <SiteNav />
                <main className="mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center animate-in fade-in duration-500">
                    <h1 className="font-serif text-3xl text-primary">Product not found</h1>
                    <p className="mt-2 text-muted-foreground">The item you are looking for does not exist.</p>
                    <Button asChild className="mt-6"><Link to="/shop">Back to shop</Link></Button>
                </main>
                <SiteFooter />
            </div>
        );
    }

    const buyNow = () => {
        add(product);
        navigate("/checkout");
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />
            {/* Main fade-in */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-14 animate-in fade-in duration-700 ease-out">

                <nav className="mb-6 text-xs uppercase tracking-widest text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link> / <span className="text-primary">{product.category}</span>
                </nav>

                <div className="grid gap-8 md:grid-cols-2 md:gap-14">
                    <div
                        className="overflow-hidden rounded-2xl bg-card ring-1 ring-border animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                        style={{ animationDelay: "100ms" }}
                    >
                        <img src={product.image} alt={product.name} width={800} height={1000} className="aspect-4/5 w-full object-cover" />
                    </div>

                    <div
                        className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                        style={{ animationDelay: "250ms" }}
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-accent">{product.category}</p>
                        <h1 className="mt-2 font-serif text-4xl text-primary md:text-5xl">{product.name}</h1>
                        <p className="mt-4 text-2xl font-semibold text-foreground">{formatINR(product.price)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes · Free shipping in India</p>
                        <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button size="lg" onClick={() => { add(product); toast.success("Added to cart"); }} variant="outline" className="h-12 px-6 cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                <ShoppingBag className="mr-2 h-4 w-4" /> Add to cart
                            </Button>
                            <Button size="lg" onClick={buyNow} className="h-12 px-6 shadow-(--shadow-luxe) cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                Buy now
                            </Button>
                        </div>

                        <div className="mt-10 grid gap-4 border-t border-border pt-6 text-sm md:grid-cols-3">
                            <div className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 text-accent" /><span>Free shipping<br /><span className="text-xs text-muted-foreground">Delivered in 4–7 days</span></span></div>
                            <div className="flex items-start gap-2"><RotateCcw className="mt-0.5 h-4 w-4 text-accent" /><span>Easy returns<br /><span className="text-xs text-muted-foreground">7-day return policy</span></span></div>
                            <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-accent" /><span>COD available<br /><span className="text-xs text-muted-foreground">Pay on delivery</span></span></div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}