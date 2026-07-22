import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    MousePointerClick,
    ShoppingCart,
    Users,
    LogOut,
    Store,
    ExternalLink,
    UserCheck // ⚡ NEW ICON IMPORT
} from "lucide-react";

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // ⚡ ADDED 'Registered Users' TO NAV ITEMS
    const navItems = [
        { name: "Overview", shortName: "Overview", path: "/admin", icon: LayoutDashboard },
        { name: "Traffic & Clicks", shortName: "Traffic", path: "/admin/analytics", icon: MousePointerClick },
        { name: "Checkout Attempts", shortName: "Checkouts", path: "/admin/checkouts", icon: ShoppingCart },
        { name: "Live Visitors", shortName: "Visitors", path: "/admin/visitors", icon: Users },
        { name: "Registered Users", shortName: "Reg Users", path: "/admin/users", icon: UserCheck },
    ];

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className="flex min-h-screen w-full bg-muted/40 text-foreground">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <Link to="/admin" className="flex items-center gap-2 font-serif text-2xl font-bold text-primary">
                        <Store className="h-6 w-6" />
                        Loomzo Admin
                    </Link>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                    <nav className="space-y-1.5">
                        <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Analytics & Tracking
                        </p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="space-y-2 border-t border-border pt-4">
                        <Link
                            to="/"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            View Live Website
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            Exit Admin
                        </button>
                    </div>
                </div>
            </aside>

            {/* MOBILE LAYOUT */}
            <div className="flex flex-1 flex-col relative">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
                    <Link to="/admin" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
                        <Store className="h-5 w-5" />
                        Loomzo
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors" aria-label="View Live Website">
                            <ExternalLink className="h-5 w-5" />
                        </Link>
                        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Exit Admin">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">
                    <Outlet />
                </main>

                <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card pb-safe md:hidden">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`h-5.5 w-5.5 ${isActive ? "fill-primary/20" : ""}`} />
                                <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                                    {item.shortName}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}