import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { categories, products, formatINR } from "../lib/products";
import { cn } from "../lib/utils";

export function Shop() {
    const location = useLocation();

    // Initialize the filter based on the passed state, defaulting to "All"
    const [filter, setFilter] = useState(location.state?.category || "All");

    // Scroll to top on mount or when location state changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.state]);

    // Listen for changes in the navigation state (e.g., clicking the "Shop" link in the nav bar)
    useEffect(() => {
        if (location.state?.category) {
            setFilter(location.state.category);
        } else {
            setFilter("All");
        }
    }, [location.state]);

    const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />
            {/* Main fade-in */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-8 md:py-16 animate-in fade-in duration-700 ease-out">

                <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-xs uppercase tracking-[0.3em] text-accent">The Loomzo Edit</p>
                    <h1 className="mt-2 font-serif text-4xl text-primary md:text-5xl">Every Saree, A Story</h1>
                </div>

                <div
                    className="mb-8 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                    style={{ animationDelay: "150ms" }}
                >
                    {["All", ...categories.map((c) => c.name)].map((c) => (
                        <button
                            key={c}
                            onClick={() => setFilter(c)}
                            className={cn(
                                "rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition cursor-pointer hover:shadow-sm",
                                filter === c ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background hover:border-primary/60"
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <div key={filter} className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
                    {filtered.map((p, index) => (
                        <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            className="group block animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="aspect-4/5 overflow-hidden rounded-xl bg-card ring-1 ring-border transition-all duration-300 group-hover:shadow-md">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    loading="lazy"
                                    width={800}
                                    height={1000}
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="mt-3">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-accent">
                                    {p.category}
                                </p>
                                <h3 className="mt-1 font-serif text-lg text-primary">{p.name}</h3>
                                <p className="text-sm font-semibold">{formatINR(p.price)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}