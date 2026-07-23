import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { categories, products, formatINR } from "../lib/products";
import { cn } from "../lib/utils";
import { Star } from "lucide-react";
import { trackEvent } from "../lib/tracker";

// 1. Import the new image from your assets folder
import p7Image from "../assets/p7.png";

// ⚡ Helper: Prevent spam clicks per session
const recordProductClick = (productName) => {
    if (!productName) return;
    const tracked = JSON.parse(sessionStorage.getItem("loomzo_tracked_products") || "[]");
    if (!tracked.includes(productName)) {
        tracked.push(productName);
        sessionStorage.setItem("loomzo_tracked_products", JSON.stringify(tracked));
        trackEvent("product_click", { productName });
    }
};

export function Shop() {
    const location = useLocation();
    const [filter, setFilter] = useState(location.state?.category || "All");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.state]);

    useEffect(() => {
        if (location.state?.category) {
            setFilter(location.state.category);
        } else {
            setFilter("All");
        }
    }, [location.state]);

    // 2. Inject the new saree into a combined products list
    const allProducts = [
        ...products,
        {
            id: "p7-khaddi-georgette",
            name: "Red Khaddi Georgette Banarasi",
            category: "Youth & Trend", // Make sure this perfectly matches your category name string
            price: 1999,
            image: p7Image
        }
    ];

    // 3. Update the filter logic to use the new 'allProducts' array instead of the imported 'products'
    const filtered = filter === "All" ? allProducts : allProducts.filter((p) => p.category === filter);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-10 pb-32 md:px-8 md:pt-16 md:pb-24 animate-in fade-in duration-700 ease-out">

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
                            onClick={() => recordProductClick(p.name)} // ⚡ Track click safely
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
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-accent">
                                        {p.category}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        4.8
                                    </div>
                                </div>
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