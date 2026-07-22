import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Home, Store, LayoutGrid, Search, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, signup, logout } from "../store/authSlice";
import { useCart } from "../lib/cart";
import { products, formatINR } from "../lib/products";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export function SiteNav() {
    const { count } = useCart();
    const location = useLocation();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState("signin");
    const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleAuth = async (e) => {
        e.preventDefault();

        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }

        setIsLoading(true);

        try {
            const endpoint = authMode === "signin" ? "/api/auth/login" : "/api/auth/signup";
            const payload = authMode === "signin"
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, mobile: formData.mobile, password: formData.password };

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                if (authMode === "signin") {
                    dispatch(login({ user: data.user, token: data.token }));
                    toast.success(`Welcome back, ${data.user.name || 'to Loomzo'}!`);
                } else {
                    dispatch(signup({ user: data.user, token: data.token }));
                    toast.success("Account created successfully! Welcome to the tribe.");
                }

                setAuthOpen(false);
                setFormData({ name: "", email: "", mobile: "", password: "" });
            } else {
                toast.error(data.message || "Authentication failed.");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            toast.error("Network error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.info("You have successfully logged out.");
    };

    const handleModalClose = (isOpen) => {
        if (!isOpen) {
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
            setTimeout(() => setAuthMode("signin"), 300);
        }
        setAuthOpen(isOpen);
    };

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "Categories", path: "/categories" },
    ];

    const searchResults = searchQuery.trim() === ""
        ? []
        : products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6);

    const CartButton = () => (
        <Link to="/cart" className="relative rounded-full p-2 hover:bg-secondary transition cursor-pointer" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground transition-transform animate-in zoom-in">
                    {count}
                </span>
            )}
        </Link>
    );

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                body[data-scroll-locked] {
                    padding-right: 0 !important;
                }
            `}} />

            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
                <div className="mx-auto flex h-18 max-w-7xl items-center px-4 md:px-8 gap-3 md:gap-6">

                    <Link to="/" className="flex items-baseline gap-1 transition-opacity hover:opacity-80 shrink-0 z-10">
                        <span className="font-serif text-4xl md:text-[2.5rem] leading-none font-medium tracking-tight text-primary">Loomzo</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-accent hidden md:inline">India</span>
                    </Link>

                    <div className="flex flex-1 items-center justify-end relative h-full">

                        <div className={`flex items-center gap-2 md:gap-8 transition-all duration-300 ease-in-out ${isSearchOpen ? 'opacity-0 invisible scale-95 pointer-events-none' : 'opacity-100 visible scale-100 pointer-events-auto'}`}>
                            <nav className="hidden items-center gap-8 md:flex">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="flex items-center gap-1 md:gap-4 shrink-0">

                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="p-2 text-foreground hover:text-primary transition cursor-pointer rounded-full hover:bg-secondary shrink-0"
                                        aria-label="Admin Dashboard"
                                    >
                                        <LayoutDashboard className="h-6 w-6 md:h-5 md:w-5" />
                                    </Link>
                                )}

                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 text-foreground hover:text-primary transition cursor-pointer rounded-full hover:bg-secondary shrink-0"
                                >
                                    <Search className="h-6 w-6 md:h-5 md:w-5" />
                                </button>

                                <div className="hidden md:flex items-center gap-4">
                                    {isAuthenticated ? (
                                        <>
                                            <span className="text-sm font-medium text-primary flex items-center gap-2">
                                                <User className="h-4 w-4" /> {user?.name || user?.email?.split('@')[0]}
                                            </span>
                                            <Button variant="ghost" size="sm" onClick={handleLogout} className="cursor-pointer">
                                                Sign out
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)} className="cursor-pointer">
                                            Sign in
                                        </Button>
                                    )}
                                    <CartButton />
                                </div>
                            </div>
                        </div>

                        <div className={`absolute inset-y-0 right-0 flex items-center w-full transition-all duration-500 ease-in-out ${isSearchOpen ? 'opacity-100 visible translate-x-0 pointer-events-auto' : 'opacity-0 invisible translate-x-8 pointer-events-none'}`}>
                            <div className="flex w-full items-center gap-2 md:gap-3">
                                <div className="flex flex-1 items-center bg-secondary/40 rounded-full pl-4 pr-2 h-11 md:h-12 border border-border focus-within:border-primary/50 transition-colors shadow-inner">
                                    <Search className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0 mr-2 md:mr-3" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Banarasee Silk, Wedding Sarees..."
                                        className="flex-1 bg-transparent h-full outline-none text-sm md:text-base font-serif placeholder:text-muted-foreground/70 text-foreground w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="p-1.5 hover:bg-background/80 rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors"
                                        >
                                            <X className="h-3 w-3 md:h-4 md:w-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                                    className="p-2 shrink-0 hover:bg-secondary rounded-full cursor-pointer transition-colors text-foreground"
                                    aria-label="Close search"
                                >
                                    <X className="h-5 w-5 md:h-6 md:w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isSearchOpen && searchQuery.trim() !== "" && (
                    <div className="absolute top-18 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-xl max-h-[70vh] overflow-y-auto z-40 animate-in fade-in slide-in-from-top-2">
                        <div className="max-w-7xl mx-auto p-4 md:p-8">
                            {searchResults.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {searchResults.map(p => (
                                        <Link
                                            key={p.id}
                                            to={`/product/${p.id}`}
                                            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors border border-transparent hover:border-border"
                                        >
                                            <img src={p.image} alt={p.name} className="h-20 w-16 object-cover rounded-md shadow-sm" />
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-accent mb-0.5">{p.category}</p>
                                                <p className="font-serif text-primary text-base line-clamp-1">{p.name}</p>
                                                <p className="text-sm font-semibold mt-1">{formatINR(p.price)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="font-serif text-lg text-primary">No authentic weaves found for "{searchQuery}"</p>
                                    <p className="text-sm text-muted-foreground mt-2">Try searching for a different category or style.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-md pb-safe transform-gpu">
                <div className="flex h-17 justify-around items-center px-2 text-[10px] font-medium text-muted-foreground">
                    <Link to="/" className={`flex flex-col items-center gap-1.5 transition-colors ${location.pathname === '/' ? 'text-primary' : 'hover:text-foreground'}`}>
                        <Home className="h-5.5 w-5.5" />
                        <span>Home</span>
                    </Link>

                    <Link to="/categories" className={`flex flex-col items-center gap-1.5 transition-colors ${location.pathname === '/categories' ? 'text-primary' : 'hover:text-foreground'}`}>
                        <LayoutGrid className="h-5.5 w-5.5" />
                        <span>Categories</span>
                    </Link>

                    <Link to="/shop" className={`flex flex-col items-center gap-1.5 transition-colors ${location.pathname === '/shop' ? 'text-primary' : 'hover:text-foreground'}`}>
                        <Store className="h-5.5 w-5.5" />
                        <span>Shop</span>
                    </Link>

                    <Link to="/cart" className={`flex flex-col items-center gap-1.5 relative transition-colors ${location.pathname === '/cart' ? 'text-primary' : 'hover:text-foreground'}`}>
                        <div className="relative">
                            <ShoppingBag className="h-5.5 w-5.5" />
                            {count > 0 && (
                                <span className="absolute -right-2 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                                    {count}
                                </span>
                            )}
                        </div>
                        <span>Cart</span>
                    </Link>

                    <button
                        onClick={() => isAuthenticated ? handleLogout() : setAuthOpen(true)}
                        className={`flex flex-col items-center gap-1.5 transition-colors ${isAuthenticated ? 'text-primary' : 'hover:text-foreground'} cursor-pointer`}
                    >
                        {isAuthenticated ? (
                            <>
                                <LogOut className="h-5.5 w-5.5" />
                                <span>Logout</span>
                            </>
                        ) : (
                            <>
                                <User className="h-5.5 w-5.5" />
                                <span>Account</span>
                            </>
                        )}
                    </button>
                </div>
            </nav>

            <Dialog open={authOpen} onOpenChange={handleModalClose}>
                <DialogContent className="w-[90vw] max-w-95 rounded-3xl p-6 transition-all duration-300 md:max-w-md">
                    <div className="text-center mb-6 relative min-h-20">
                        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${authMode === "signin" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                            <h2 className="font-serif text-3xl text-primary">Sign In</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access your Loomzo account.</p>
                        </div>
                        <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${authMode === "signup" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
                            <h2 className="font-serif text-3xl text-primary">Create Account</h2>
                            <p className="mt-2 text-sm text-muted-foreground">Join the Loomzo tribe to track orders and checkout faster.</p>
                        </div>
                    </div>

                    <form onSubmit={handleAuth} className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
                        <div className={`grid transition-all duration-400 ease-in-out ${authMode === "signup" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="overflow-hidden">
                                <div className="space-y-1 pb-1">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Your Name"
                                        required={authMode === "signup"}
                                        className="mt-1.5 transition-colors"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                className="mt-1.5 transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className={`grid transition-all duration-400 ease-in-out ${authMode === "signup" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="overflow-hidden">
                                <div className="space-y-1 pb-1">
                                    <Label htmlFor="mobile">Mobile Number</Label>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        placeholder="+91 9876543210"
                                        required={authMode === "signup"}
                                        className="mt-1.5 transition-colors"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="mt-1.5 transition-colors"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="w-full mt-2 shadow-(--shadow-luxe) cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {isLoading ? "Please wait..." : (authMode === "signin" ? "Sign In" : "Sign Up")}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm relative h-6">
                        <div className={`absolute inset-0 transition-all duration-500 ${authMode === "signin" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                            <p className="text-muted-foreground">
                                Don't have an account?{" "}
                                <button type="button" onClick={() => setAuthMode("signup")} className="font-medium text-primary hover:underline cursor-pointer transition-colors">
                                    Sign up
                                </button>
                            </p>
                        </div>
                        <div className={`absolute inset-0 transition-all duration-500 ${authMode === "signup" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <button type="button" onClick={() => setAuthMode("signin")} className="font-medium text-primary hover:underline cursor-pointer transition-colors">
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function SiteFooter() {
    return (
        <footer className="hidden md:block mt-20 border-t border-border/60 bg-secondary/20 transition-colors">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:gap-8 md:px-8">

                <div className="md:col-span-2">
                    <Link to="/" className="inline-block font-serif text-3xl font-bold text-primary tracking-tight transition-opacity hover:opacity-80">
                        Loomzo
                    </Link>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Handcrafted sarees, woven with love in India. From breezy organzas to regal Banarasis, discover drapes that tell a story.
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Shop Collections</h3>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li>
                            <Link to="/shop" state={{ category: "Youth & Trend" }} className="hover:text-primary transition-colors duration-200">Youth &amp; Trend</Link>
                        </li>
                        <li>
                            <Link to="/shop" state={{ category: "Festive & Bridal" }} className="hover:text-primary transition-colors duration-200">Festive &amp; Bridal</Link>
                        </li>
                        <li>
                            <Link to="/shop" state={{ category: "Timeless Elegance" }} className="hover:text-primary transition-colors duration-200">Timeless Elegance</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Need Help?</h3>
                    <p className="mt-4 text-sm text-muted-foreground mb-5">
                        Cash on Delivery available across India. Reach out to us directly!
                    </p>

                    <a
                        href="https://wa.me/918318538918"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Chat on WhatsApp
                    </a>
                </div>
            </div>

            <div className="border-t border-border/60 bg-secondary/50 py-5 text-center text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} Loomzo. All rights reserved.</p>
            </div>
        </footer>
    );
}