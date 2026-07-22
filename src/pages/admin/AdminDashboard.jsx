import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ArrowUpRight, MousePointerClick, ShoppingCart, IndianRupee, Users, Banknote } from "lucide-react";

// Adjust this import path if your products.js is located somewhere else!
import { formatINR } from "../../lib/products";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export function AdminDashboard() {
    const [stats, setStats] = useState({
        totalAdClicks: 0,
        checkoutAttempts: 0,
        estAdSpend: 1500,
        estCAC: "0.00",
        conversionRate: "0.0",
        totalRevenue: 0
    });

    // 1. Initial Data Fetch
    const fetchStats = () => {
        fetch(`${API_URL}/api/track/stats`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStats(data);
                }
            })
            .catch((err) => console.error("Error fetching stats:", err));
    };

    useEffect(() => {
        fetchStats();

        // 2. Connect to Socket.io for REAL-TIME updates
        const socket = io(API_URL);

        socket.on("admin:realtime_event", (newEvent) => {
            // Automatically increment metrics based on live incoming event
            setStats((prev) => {
                const newTotalClicks = newEvent.eventType === "page_view" ? prev.totalAdClicks + 1 : prev.totalAdClicks;
                const newCheckouts = newEvent.eventType === "checkout_attempt" ? prev.checkoutAttempts + 1 : prev.checkoutAttempts;
                const newCAC = newCheckouts > 0 ? (prev.estAdSpend / newCheckouts).toFixed(2) : "0.00";
                const newConv = newTotalClicks > 0 ? ((newCheckouts / newTotalClicks) * 100).toFixed(1) : "0.0";

                // Add the new order's total to the existing revenue
                const newRevenue = newEvent.eventType === "checkout_attempt" ? prev.totalRevenue + (newEvent.orderTotal || 0) : prev.totalRevenue;

                return {
                    ...prev,
                    totalAdClicks: newTotalClicks,
                    checkoutAttempts: newCheckouts,
                    estCAC: newCAC,
                    conversionRate: newConv,
                    totalRevenue: newRevenue
                };
            });
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-serif text-2xl md:text-3xl text-primary">Overview</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">Real-time live metrics for your Painted Door test.</p>

            {/* Responsive Grid: 1 col on Mobile -> 2 on Tablet -> 3 on Desktop -> 5 on Widescreen */}
            <div className="mt-6 md:mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                {/* Card 1: Ad Clicks */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Ad Clicks</p>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold">{stats.totalAdClicks}</h2>
                    </div>
                </div>

                {/* Card 2: Checkouts */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Checkouts</p>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold">{stats.checkoutAttempts}</h2>
                        <span className="flex items-center text-[10px] md:text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" /> {stats.conversionRate}%
                        </span>
                    </div>
                </div>

                {/* Card 3: Est. Revenue (Spans 2 columns on small tablets to keep layout balanced) */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-500">Est. Revenue</p>
                        <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-500 truncate">
                            {formatINR ? formatINR(stats.totalRevenue) : `₹${stats.totalRevenue}`}
                        </h2>
                    </div>
                </div>

                {/* Card 4: Est. Ad Spend */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">Est. Ad Spend</p>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold">₹{stats.estAdSpend}</h2>
                    </div>
                </div>

                {/* Card 5: Est. CAC */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-medium text-primary">Est. CAC</p>
                        <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-primary">₹{stats.estCAC}</h2>
                    </div>
                </div>

            </div>
        </div>
    );
}