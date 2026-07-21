import { Link } from "react-router-dom";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { categories, products, formatINR } from "../lib/products.js";
import hero from "../assets/hero.jpg";
import { ArrowRight } from "lucide-react";

export function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />
            <main className="flex-1 animate-in fade-in duration-700 ease-out">

                {/* HERO */}
                <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
                    <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-8 md:py-20">

                        <div className="order-2 md:order-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-accent-foreground/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> New Season Drop
                            </div>
                            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-primary md:text-7xl">
                                Woven with<br />love, worn<br />with pride.
                            </h1>
                            <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
                                Discover Loomzo — a curated house of handcrafted Indian sarees. From breezy organzas to regal Banarasis, every drape tells a story.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button asChild size="lg" className="h-12 px-6 text-base shadow-(--shadow-luxe) transition-transform hover:scale-105 active:scale-95">
                                    <Link to="/shop">Explore the Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base transition-transform hover:scale-105 active:scale-95">
                                    <Link to="/categories">View categories</Link>
                                </Button>
                            </div>
                            <div className="mt-10 flex flex-wrap gap-6 text-xs uppercase tracking-widest text-muted-foreground">
                                <span>✓ Cash on Delivery</span>
                                <span>✓ Free Shipping in India</span>
                                <span>✓ Easy Returns</span>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 animate-in fade-in duration-1000 slide-in-from-right-4">
                            <div className="relative mx-auto max-w-md md:max-w-none">
                                <div className="absolute -inset-4 rounded-4xl bg-accent/20 blur-2xl" />
                                <img src={hero} alt="Woman in a maroon and gold Loomzo saree" width={1600} height={1200} className="relative aspect-4/5 w-full rounded-3xl object-cover shadow-(--shadow-luxe)" />
                            </div>
                        </div>

                    </div>
                </section>

                {/* CATEGORIES */}
                <section id="categories" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
                    <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-xs uppercase tracking-[0.3em] text-accent">Curated Collections</p>
                        <h2 className="mt-2 font-serif text-4xl text-primary md:text-5xl">Three worlds. One weave.</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {categories.map((c, index) => {
                            const featured = products.find((p) => p.category === c.name);
                            return (
                                <Link
                                    key={c.name}
                                    to="/shop"
                                    state={{ category: c.name }} // <-- ADDED THIS LINE HERE
                                    className="group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-luxe) animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="aspect-4/5 overflow-hidden">
                                        <img src={featured?.image} alt={c.name} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent p-6 text-primary-foreground">
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-accent">{c.tagline}</p>
                                        <h3 className="mt-1 font-serif text-2xl">{c.name}</h3>
                                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium">Shop now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /></span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* BEST SELLERS */}
                <section className="bg-secondary/40">
                    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
                        <div className="mb-10 flex items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-accent">Bestsellers</p>
                                <h2 className="mt-2 font-serif text-4xl text-primary md:text-5xl">Loved by the Loomzo tribe</h2>
                            </div>
                            <Link to="/shop" className="hidden text-sm font-medium text-primary underline-offset-4 hover:underline md:inline transition-colors hover:text-accent">View all</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                            {products.slice(0, 3).map((p, index) => (
                                <div key={p.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                                    <ProductCard p={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <SiteFooter />
        </div>
    );
}

function ProductCard({ p }) {
    return (
        <Link to={`/product/${p.id}`} className="group block h-full">
            <div className="aspect-4/5 overflow-hidden rounded-xl bg-card ring-1 ring-border transition-all duration-300 group-hover:shadow-md">
                <img src={p.image} alt={p.name} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-accent">{p.category}</p>
                <h3 className="mt-1 font-serif text-lg text-primary">{p.name}</h3>
                <p className="text-sm font-semibold">{formatINR(p.price)}</p>
            </div>
        </Link>
    );
}