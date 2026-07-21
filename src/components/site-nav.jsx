import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, signup, logout } from "../store/authSlice";
import { useCart } from "../lib/cart";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function SiteNav() {
    const { count } = useCart();
    const location = useLocation(); // Gets the current route path

    const [open, setOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState("signin");
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // Prevent scrolling on the main page when the mobile drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [open]);

    const handleAuth = (e) => {
        e.preventDefault();
        setAuthOpen(false);

        if (authMode === "signin") {
            dispatch(login({ email: formData.email, name: formData.email.split("@")[0] }));
            toast.success("Welcome back to Loomzo!");
        } else {
            dispatch(signup({ email: formData.email, name: formData.name || "User" }));
            toast.success("Account created successfully! Welcome to the tribe.");
        }
        setFormData({ name: "", email: "", password: "" });
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.info("You have successfully logged out.");
    };

    const handleModalClose = (isOpen) => {
        setAuthOpen(isOpen);
        if (!isOpen) {
            setTimeout(() => setAuthMode("signin"), 300);
        }
    };

    // Array of navigation items for easy mapping and active-state checking
    const navItems = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "Categories", path: "/categories" },
    ];

    // Reusable Cart Icon to keep code clean
    const CartButton = () => (
        <Link to="/cart" onClick={() => setOpen(false)} className="relative rounded-full p-2 hover:bg-secondary transition cursor-pointer" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground transition-transform animate-in zoom-in">
                    {count}
                </span>
            )}
        </Link>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">

            {/* MAIN NAVBAR GRID */}
            <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-4 md:px-8">

                {/* LEFT: Mobile Menu Button */}
                <div className="flex justify-start md:hidden">
                    <button className="p-2 -ml-2 cursor-pointer text-foreground transition-colors hover:text-primary" onClick={() => setOpen(true)} aria-label="Menu">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* LEFT: Desktop Logo */}
                <div className="hidden md:flex justify-start">
                    <Link to="/" className="flex items-center gap-1 transition-opacity hover:opacity-80">
                        <span className="font-serif text-2xl font-bold tracking-tight text-primary">Loomzo</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-accent">India</span>
                    </Link>
                </div>

                {/* CENTER: Mobile Logo & Desktop Links */}
                <div className="flex justify-center">
                    {/* Mobile Only Logo */}
                    <Link to="/" className="flex md:hidden items-center transition-opacity hover:opacity-80">
                        <span className="font-serif text-2xl font-bold tracking-tight text-primary">Loomzo</span>
                    </Link>

                    {/* Desktop Only Navigation Links with Active State */}
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
                </div>

                {/* RIGHT: Auth & Cart Icons */}
                <div className="flex justify-end items-center gap-1 md:gap-2">

                    {/* Mobile Auth Icon */}
                    <div className="md:hidden">
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="relative rounded-full p-2 hover:bg-secondary transition cursor-pointer" aria-label="Account">
                                <User className="h-5 w-5 text-primary" />
                            </button>
                        ) : (
                            <button onClick={() => setAuthOpen(true)} className="relative rounded-full p-2 hover:bg-secondary transition cursor-pointer" aria-label="Sign In">
                                <User className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4 mr-2">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm font-medium text-primary flex items-center gap-2">
                                    <User className="h-4 w-4" /> {user?.name}
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
                    </div>

                    {/* Cart always on the right */}
                    <CartButton />
                </div>
            </div>

            {/* MOBILE SIDE DRAWER OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MOBILE SIDE DRAWER PANEL */}
            <div
                className={`fixed top-0 left-0 z-50 h-dvh w-[80vw] max-w-sm bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-border/60 px-6 py-5 bg-background">
                    <span className="font-serif text-2xl font-bold tracking-tight text-primary">Loomzo</span>
                    <button className="rounded-full p-2 -mr-2 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-primary cursor-pointer transition-colors" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Drawer Menu Options (Redesigned UI with Active Highlight) */}
                <div className="flex flex-col p-4 overflow-y-auto bg-background flex-1 gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                className={`rounded-xl px-4 py-3 text-lg font-serif tracking-wide transition-all ${isActive
                                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                    : "text-foreground hover:bg-secondary/60 hover:text-primary"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Optional subtle footer for the drawer */}
                <div className="p-6 border-t border-border/60 bg-secondary/20">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Authentic Weaves</p>
                    <p className="text-sm font-serif text-foreground">Crafted with love in India.</p>
                </div>
            </div>

            {/* AUTH MODAL WITH SMOOTH TRANSITIONS */}
            <Dialog open={authOpen} onOpenChange={handleModalClose}>
                <DialogContent className="max-w-md p-6 transition-all duration-300">
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

                        <Button type="submit" size="lg" className="w-full mt-2 shadow-(--shadow-luxe) cursor-pointer transition-all hover:scale-[1.02] active:scale-95">
                            {authMode === "signin" ? "Sign In" : "Sign Up"}
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
        </header>
    );
}

export function SiteFooter() {
    return (
        <footer className="mt-20 border-t border-border/60 bg-secondary/20 transition-colors">
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
                            {/* Updated with state={{ category: "Youth & Trend" }} */}
                            <Link to="/shop" state={{ category: "Youth & Trend" }} className="hover:text-primary transition-colors duration-200">Youth &amp; Trend</Link>
                        </li>
                        <li>
                            {/* Updated with state={{ category: "Festive & Bridal" }} */}
                            <Link to="/shop" state={{ category: "Festive & Bridal" }} className="hover:text-primary transition-colors duration-200">Festive &amp; Bridal</Link>
                        </li>
                        <li>
                            {/* Updated with state={{ category: "Timeless Elegance" }} */}
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