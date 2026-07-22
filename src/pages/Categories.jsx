import { Link } from "react-router-dom";
import { useEffect } from "react";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { categories, products } from "../lib/products";
import { ArrowRight } from "lucide-react";

export function Categories() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />

            <main className="mx-auto flex-1 w-full max-w-7xl px-4 pt-10 pb-32 md:px-8 md:pt-16 md:pb-24 animate-in fade-in duration-700 ease-out">

                <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-xs uppercase tracking-[0.3em] text-accent">Curated Collections</p>
                    <h1 className="mt-2 font-serif text-4xl text-primary md:text-5xl">Shop by Category</h1>
                    <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
                        Explore our handpicked selections of artisanal sarees, woven for every occasion, mood, and timeless style.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {categories.map((c, index) => {
                        const featured = products.find((p) => p.category === c.name);

                        return (
                            <Link
                                key={c.name}
                                to="/shop"
                                state={{ category: c.name }}
                                className="group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-luxe) animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
                                style={{ animationDelay: `${(index + 1) * 150}ms` }}
                            >
                                <div className="aspect-4/5 overflow-hidden">
                                    <img
                                        src={featured?.image}
                                        alt={c.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* 1. Stretched the gradient higher with pt-28 and made the base color fully opaque */}
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary via-primary/90 to-transparent p-6 pt-28 text-primary-foreground">

                                    {/* 2. Changed text to crisp white (text-white/90), added font-bold, and a bottom margin (mb-1) */}
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/90 drop-shadow-md">
                                        {c.tagline}
                                    </p>

                                    <h3 className="font-serif text-2xl text-white drop-shadow-lg">{c.name}</h3>

                                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/90 drop-shadow-md">
                                        Explore collection <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}