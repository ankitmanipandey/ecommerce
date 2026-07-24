import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { categories, products, formatINR, findProduct } from "../lib/products.js";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

import hero1 from "../assets/hero.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import { trackEvent } from "../lib/tracker.js";

const recordProductClick = (productName) => {
    if (!productName) return;
    const tracked = JSON.parse(sessionStorage.getItem("loomzo_tracked_products") || "[]");
    if (!tracked.includes(productName)) {
        tracked.push(productName);
        sessionStorage.setItem("loomzo_tracked_products", JSON.stringify(tracked));
        trackEvent("product_click", { productName });
    }
};

export function Home() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const carouselSlides = [
        { id: "3", image: hero1, alt: "Woman in a maroon and gold Loomzo saree" },
        { id: "2", image: hero2, alt: "Lady wearing a beautiful Banarasee Organza saree" },
        { id: "4", image: hero3, alt: "Married woman wearing a heavy Emerald Brocade saree" },
    ];

    const extendedSlides = [
        carouselSlides[carouselSlides.length - 1],
        ...carouselSlides,
        carouselSlides[0]
    ];

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setTransitionEnabled(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isAnimating]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setTransitionEnabled(true);
        setCurrentIndex((prev) => prev - 1);
    }, [isAnimating]);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(timer);
    }, [isHovered, nextSlide]);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            if (currentIndex === extendedSlides.length - 1) {
                setTransitionEnabled(false);
                setCurrentIndex(1);
            } else if (currentIndex === 0) {
                setTransitionEnabled(false);
                setCurrentIndex(extendedSlides.length - 2);
            }
            setIsAnimating(false);
        }, 700);

        return () => clearTimeout(timer);
    }, [currentIndex, extendedSlides.length]);

    useEffect(() => {
        if (!transitionEnabled) {
            const frame = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTransitionEnabled(true);
                });
            });
            return () => cancelAnimationFrame(frame);
        }
    }, [transitionEnabled]);

    let activeDotIndex = currentIndex - 1;
    if (activeDotIndex < 0) activeDotIndex = carouselSlides.length - 1;
    if (activeDotIndex >= carouselSlides.length) activeDotIndex = 0;

    const minSwipeDistance = 50;
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextSlide();
        if (distance < -minSwipeDistance) prevSlide();
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />
            <main className="flex-1 animate-in fade-in duration-700 ease-out">
                <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
                    <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-6 pb-12 md:grid-cols-2 md:gap-12 md:px-8 md:pt-10 md:pb-20">
                        <div className="order-2 md:order-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-accent-foreground/80 shadow-sm">
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
                                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base transition-transform hover:scale-105 active:scale-95 border-border hover:bg-secondary/50">
                                    <Link to="/categories">View categories</Link>
                                </Button>
                            </div>
                            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-xs uppercase tracking-widest text-muted-foreground">
                                <span className="flex items-center gap-1.5"><CheckIcon /> Cash on Delivery</span>
                                <span className="flex items-center gap-1.5"><CheckIcon /> Free Shipping</span>
                                <span className="flex items-center gap-1.5 text-primary font-bold bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                                    <CheckIcon /> 7-Day Returns
                                </span>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 animate-in fade-in duration-1000 slide-in-from-right-4">
                            <div className="relative mx-auto max-w-md md:max-w-none">
                                <div className="absolute -inset-4 rounded-4xl bg-accent/10 blur-3xl" />

                                <div
                                    className="relative overflow-hidden rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] ring-1 ring-border/50 aspect-4/5 group bg-secondary/50"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                >
                                    <div
                                        className={`flex h-full w-full ${transitionEnabled ? "transition-transform duration-700 ease-in-out" : ""}`}
                                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                    >
                                        {extendedSlides.map((slide, index) => {
                                            const pData = findProduct(slide.id);
                                            return (
                                                <Link
                                                    key={`${slide.id}-${index}`}
                                                    to={`/product/${slide.id}`}
                                                    onClick={() => pData && recordProductClick(pData.name)}
                                                    className="relative h-full w-full shrink-0 cursor-pointer block"
                                                >
                                                    <img
                                                        src={slide.image}
                                                        alt={slide.alt}
                                                        width={1600}
                                                        height={1200}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
                                        {carouselSlides.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setTransitionEnabled(true);
                                                    setCurrentIndex(i + 1);
                                                }}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${activeDotIndex === i ? "bg-white w-6 opacity-100" : "bg-white/60 w-1.5 hover:bg-white/90"} cursor-pointer`}
                                                aria-label={`Go to slide ${i + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md p-2.5 rounded-full text-white opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-black/40 hover:scale-105 cursor-pointer shadow-lg"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-md p-2.5 rounded-full text-white opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-black/40 hover:scale-105 cursor-pointer shadow-lg"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="categories" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
                    <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">Curated Collections</p>
                        <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl tracking-tight">Three worlds. One weave.</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {categories.map((c, index) => {
                            const featured = products.find((p) => p.category === c.name);
                            return (
                                <Link
                                    key={c.name}
                                    to="/shop"
                                    state={{ category: c.name }}
                                    className="group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="aspect-4/5 overflow-hidden bg-secondary/20">
                                        <img src={featured?.image} alt={c.name} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/95 via-primary/70 to-transparent p-6 pt-24 text-primary-foreground">
                                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/95 drop-shadow-md">{c.tagline}</p>
                                        <h3 className="mt-1.5 font-serif text-2xl drop-shadow-md tracking-wide">{c.name}</h3>
                                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold drop-shadow-sm tracking-wide opacity-90 group-hover:opacity-100 transition-opacity">
                                            Shop collection <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="bg-secondary/30 border-t border-border/50">
                    <div className="mx-auto max-w-7xl px-4 py-16 pb-28 md:px-8 md:py-24 md:pb-24">
                        <div className="mb-12 flex items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">Bestsellers</p>
                                <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl tracking-tight">Loved by the Loomzo tribe</h2>
                            </div>
                            <Link to="/shop" className="hidden text-sm font-semibold text-primary/80 underline-offset-4 hover:underline md:inline transition-colors hover:text-primary">
                                View all weaves
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
                            {products.slice(0, 3).map((p, index) => (
                                <div key={p.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                                    <ProductCard p={p} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center md:hidden">
                            <Button asChild variant="outline" className="rounded-full px-8">
                                <Link to="/shop">View all weaves</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

function ProductCard({ p }) {
    const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

    return (
        <Link
            to={`/product/${p.id}`}
            onClick={() => recordProductClick(p.name)}
            className="group flex h-full flex-col"
        >
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-secondary/20 shadow-sm ring-1 ring-border/60 transition-all duration-500 group-hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] group-hover:ring-border">
                <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
            </div>

            <div className="mt-4 flex flex-1 flex-col px-1">
                {/* ⚡ Reverted back to the Amazon-style solid block */}
                {p.tag && (
                    <div className="mb-1.5 self-start">
                        <span className="rounded-sm bg-[#C7511F] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                            {p.tag}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between gap-2">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-accent line-clamp-1">
                        {p.category}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground shrink-0">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="pt-px">4.8</span>
                    </div>
                </div>

                <h3 className="mt-1.5 font-serif text-lg sm:text-xl text-primary truncate tracking-tight">{p.name}</h3>

                <div className="mt-2 flex items-baseline gap-2 sm:gap-2.5">
                    <span className="text-sm sm:text-base font-semibold text-foreground tracking-tight">{formatINR(p.price)}</span>
                    {p.originalPrice && (
                        <>
                            <span className="text-xs text-muted-foreground/50 line-through">{formatINR(p.originalPrice)}</span>
                            {/* Retained the sleek green discount pill */}
                            <span className="text-[9px] sm:text-[10px] font-bold tracking-wide text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm ring-1 ring-inset ring-emerald-600/10">
                                {discountPercent}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}