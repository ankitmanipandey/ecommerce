import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { findProduct, formatINR } from "../lib/products";
import { useCart } from "../lib/cart";
import { toast } from "sonner";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";
import { trackEvent } from "../lib/tracker";

export function ProductDetail() {
    const { id } = useParams();
    const product = findProduct(id);
    const { add } = useCart();
    const navigate = useNavigate();

    const isPremium = product?.price >= 3000;
    const isBudget = product?.price <= 1500;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (product) {
            const tracked = JSON.parse(sessionStorage.getItem("loomzo_tracked_products") || "[]");
            if (!tracked.includes(product.name)) {
                tracked.push(product.name);
                sessionStorage.setItem("loomzo_tracked_products", JSON.stringify(tracked));
                trackEvent("product_click", { productName: product.name });
            }
        }
    }, [id, product]);

    const buyNow = () => {
        add(product);
        navigate("/checkout");
    };

    if (!product) return null;

    // ⚡ Calculate discount for the detail page
    const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-10 pb-32 md:px-8 md:pt-16 md:pb-24 animate-in fade-in duration-700 ease-out">

                <nav className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
                    <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link> / <span className="text-primary">{product.category}</span>
                </nav>

                <div className="grid gap-8 md:grid-cols-2 md:gap-14">
                    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-border animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <img src={product.image} alt={product.name} className="aspect-4/5 w-full object-cover" />
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: "250ms" }}>

                        {/* ⚡ Amazon-style Badge */}
                        {product.tag && (
                            <div className="mb-3">
                                <span className="rounded-sm bg-[#C7511F] px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                                    {product.tag}
                                </span>
                            </div>
                        )}

                        <p className="text-xs uppercase tracking-[0.3em] text-accent">{product.category}</p>
                        <h1 className="mt-2 font-serif text-4xl text-primary md:text-5xl">{product.name}</h1>

                        <div className="mt-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-foreground/80">4.9</span>
                            <span className="mx-1 text-border">|</span>
                            <span>{isPremium ? "Limited Artisan Edition" : "120+ happy draped customers"}</span>
                        </div>

                        {/* ⚡ PRICE BLOCK */}
                        <div className="mt-5 flex items-end gap-3">
                            <p className="text-3xl font-semibold text-foreground">{formatINR(product.price)}</p>
                            {product.originalPrice && (
                                <>
                                    <p className="text-lg text-muted-foreground/60 line-through mb-1">{formatINR(product.originalPrice)}</p>
                                    <p className="text-sm font-bold text-emerald-600 mb-1.5">({discountPercent}% OFF)</p>
                                </>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes · Free shipping in India</p>

                        {isBudget && (
                            <div
                                onClick={() => {
                                    toast.success("Bundle activated! Add another saree to see discount.");
                                    trackEvent("budget_bundle_clicked", { productName: product.name });
                                }}
                                className="mt-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 cursor-pointer hover:bg-green-100 transition-colors"
                            >
                                <span className="text-sm font-semibold text-green-800">🎉 Buy 2, Get 10% Off!</span>
                                <span className="text-xs font-medium text-green-700 underline underline-offset-2">Apply in cart</span>
                            </div>
                        )}

                        <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

                        {/* ⚡ Modified to allow immediate purchase for ALL products */}
                        <div className="mt-8 flex flex-col gap-4">
                            {isPremium && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                                    <p className="text-sm font-semibold text-amber-900">✨ Authentic Handloom: High Demand</p>
                                    <p className="mt-1 text-xs text-amber-800/80 leading-relaxed">
                                        Due to the complex 14-day artisanal weaving process, this heirloom piece is produced in limited batches. Order now to secure yours from the current batch.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                                <Button size="lg" onClick={() => { add(product); toast.success("Added to cart"); }} variant="outline" className="h-12 px-6 cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to cart
                                </Button>
                                <Button size="lg" onClick={buyNow} className="h-12 flex-1 shadow-(--shadow-luxe) cursor-pointer transition-transform hover:scale-[1.02] active:scale-95">
                                    Buy now
                                </Button>
                            </div>
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