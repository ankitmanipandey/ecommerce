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
                            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-xs uppercase tracking-widest text-muted-foreground">
                                <span>✓ Cash on Delivery</span>
                                <span>✓ Free Shipping in India</span>
                                <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded-md">
                                    ✓ 7-Day No-Questions-Asked Returns
                                </span>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 animate-in fade-in duration-1000 slide-in-from-right-4">
                            <div className="relative mx-auto max-w-md md:max-w-none">
                                <div className="absolute -inset-4 rounded-4xl bg-accent/20 blur-2xl" />

                                <div
                                    className="relative overflow-hidden rounded-3xl shadow-(--shadow-luxe) aspect-4/5 group bg-secondary/50"
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
                                            const pData = findProduct(slide.id); // ⚡ Get product data for tracking
                                            return (
                                                <Link
                                                    key={`${slide.id}-${index}`}
                                                    to={`/product/${slide.id}`}
                                                    onClick={() => pData && recordProductClick(pData.name)} // ⚡ Track carousel click
                                                    className="relative h-full w-full shrink-0 cursor-pointer block"
                                                >
                                                    <img
                                                        src={slide.image}
                                                        alt={slide.alt}
                                                        width={1600}
                                                        height={1200}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                        {carouselSlides.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setTransitionEnabled(true);
                                                    setCurrentIndex(i + 1);
                                                }}
                                                className={`h-2 rounded-full transition-all duration-300 ${activeDotIndex === i ? "bg-white w-5" : "bg-white/50 w-2 hover:bg-white/80"} cursor-pointer`}
                                                aria-label={`Go to slide ${i + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={(e) => { e.preventDefault(); prevSlide(); }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm p-2 rounded-full text-white opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-black/40 cursor-pointer"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); nextSlide(); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm p-2 rounded-full text-white opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-black/40 cursor-pointer"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

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
                                    state={{ category: c.name }}
                                    className="group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-luxe) animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="aspect-4/5 overflow-hidden">
                                        <img src={featured?.image} alt={c.name} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/95 via-primary/80 to-transparent p-6 text-primary-foreground">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent drop-shadow-md">{c.tagline}</p>
                                        <h3 className="mt-1 font-serif text-2xl drop-shadow-lg">{c.name}</h3>
                                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium drop-shadow-md">Shop now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /></span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="bg-secondary/40">
                    <div className="mx-auto max-w-7xl px-4 py-16 pb-28 md:px-8 md:py-24 md:pb-24">
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
        <Link
            to={`/product/${p.id}`}
            onClick={() => recordProductClick(p.name)} // ⚡ Track click safely
            className="group block h-full"
        >
            <div className="aspect-4/5 overflow-hidden rounded-xl bg-card ring-1 ring-border transition-all duration-300 group-hover:shadow-md">
                <img src={p.image} alt={p.name} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
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
    );
}