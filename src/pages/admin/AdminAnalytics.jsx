import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BarChart3, Smartphone, MousePointer, ShoppingBag, CheckCircle2, XCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const getTimeAgo = (timestamp) => {
    const diffMins = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
};

export function AdminAnalytics() {
    const [traffic, setTraffic] = useState({
        total: 0,
        sources: { instagram_reel: 0, fb_carousel: 0, direct: 0 },
        devices: { Mobile: 0, Desktop: 0 }
    });

    const [productClicks, setProductClicks] = useState([]);
    const [checkoutIntents, setCheckoutIntents] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/track/traffic`).then(res => res.json()).then(data => {
            if (data.success) setTraffic({ total: data.total, sources: data.sources, devices: data.devices });
        });

        fetch(`${API_URL}/api/track/product-stats`).then(res => res.json()).then(data => {
            if (data.success) setProductClicks(data.productStats);
        });

        fetch(`${API_URL}/api/track/checkout-intents`).then(res => res.json()).then(data => {
            if (data.success) setCheckoutIntents(data.checkoutIntents);
        });

        const socket = io(API_URL);

        socket.on("admin:realtime_event", (newEvent) => {
            if (newEvent.eventType === "page_view") {
                setTraffic(prev => {
                    const newSources = { ...prev.sources };
                    const newDevices = { ...prev.devices };

                    if (newEvent.utmSource === 'instagram_reel') newSources.instagram_reel++;
                    else if (newEvent.utmSource === 'fb_carousel') newSources.fb_carousel++;
                    else newSources.direct++;

                    if (newEvent.deviceType === 'Mobile') newDevices.Mobile++;
                    else newDevices.Desktop++;

                    return { total: prev.total + 1, sources: newSources, devices: newDevices };
                });
            }

            if (newEvent.eventType === "product_click" && newEvent.productName) {
                setProductClicks(prev => {
                    const existingIndex = prev.findIndex(item => item._id === newEvent.productName);
                    if (existingIndex > -1) {
                        const updated = [...prev];
                        updated[existingIndex].clicks += 1;
                        return updated.sort((a, b) => b.clicks - a.clicks);
                    } else {
                        return [...prev, { _id: newEvent.productName, clicks: 1 }].sort((a, b) => b.clicks - a.clicks);
                    }
                });
            }

            if (newEvent.eventType === "checkout_view" && newEvent.productName) {
                setCheckoutIntents(prev => {
                    return [{
                        _id: newEvent._id,
                        productName: newEvent.productName,
                        sessionId: newEvent.sessionId,
                        timestamp: newEvent.timestamp,
                        completed: false
                    }, ...prev].slice(0, 20);
                });
            }

            if (newEvent.eventType === "checkout_attempt") {
                setCheckoutIntents(prev =>
                    prev.map(item =>
                        (item.sessionId === newEvent.sessionId && item.productName === newEvent.productName)
                            ? { ...item, completed: true }
                            : item
                    )
                );
            }
        });

        return () => socket.disconnect();
    }, []);

    const getPercent = (count) => {
        if (traffic.total === 0) return 0;
        return Math.round((count / traffic.total) * 100);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="font-serif text-2xl md:text-3xl text-primary">Traffic & Clicks</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">Analyze where your visitors are coming from and what they are clicking in real-time.</p>

            {/* Responsive Grid for Top Section: 1 col on mobile -> 2 on desktop */}
            <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">

                {/* Card 1: TOP TRAFFIC SOURCES */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 md:mb-6 flex items-center gap-2 text-primary">
                        <BarChart3 className="h-5 w-5" />
                        <h2 className="font-serif text-lg md:text-xl font-semibold">Top Traffic Sources</h2>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <div className="mb-2 flex justify-between text-xs md:text-sm font-medium">
                                <span>Instagram Reels (Ad 1)</span>
                                <span>{getPercent(traffic.sources.instagram_reel)}%</span>
                            </div>
                            <div className="h-2.5 md:h-3 w-full overflow-hidden rounded-full bg-secondary">
                                <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${getPercent(traffic.sources.instagram_reel)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between text-xs md:text-sm font-medium">
                                <span>Facebook Carousel (Ad 2)</span>
                                <span>{getPercent(traffic.sources.fb_carousel)}%</span>
                            </div>
                            <div className="h-2.5 md:h-3 w-full overflow-hidden rounded-full bg-secondary">
                                <div className="h-full bg-primary/70 transition-all duration-1000 ease-out" style={{ width: `${getPercent(traffic.sources.fb_carousel)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between text-xs md:text-sm font-medium">
                                <span>Direct / WhatsApp</span>
                                <span>{getPercent(traffic.sources.direct)}%</span>
                            </div>
                            <div className="h-2.5 md:h-3 w-full overflow-hidden rounded-full bg-secondary">
                                <div className="h-full bg-primary/40 transition-all duration-1000 ease-out" style={{ width: `${getPercent(traffic.sources.direct)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: DEVICE BREAKDOWN */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 md:mb-6 flex items-center gap-2 text-primary">
                        <Smartphone className="h-5 w-5" />
                        <h2 className="font-serif text-lg md:text-xl font-semibold">Device Breakdown</h2>
                    </div>

                    <div className="flex h-40 md:h-48 items-end justify-center gap-10 md:gap-12 pt-4">
                        <div className="group relative flex w-16 flex-col items-center justify-end">
                            <div className="w-full rounded-t-md bg-primary transition-all duration-1000 ease-out" style={{ height: `${getPercent(traffic.devices.Mobile)}%`, minHeight: '4px' }}></div>
                            <span className="mt-3 text-xs md:text-sm font-medium">Mobile ({getPercent(traffic.devices.Mobile)}%)</span>
                        </div>

                        <div className="group relative flex w-16 flex-col items-center justify-end">
                            <div className="w-full rounded-t-md bg-primary/40 transition-all duration-1000 ease-out" style={{ height: `${getPercent(traffic.devices.Desktop)}%`, minHeight: '4px' }}></div>
                            <span className="mt-3 text-xs md:text-sm font-medium">Desktop ({getPercent(traffic.devices.Desktop)}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Grid for Bottom Section: 1 col on mobile -> 2 on desktop */}
            <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">

                {/* Card 3: REAL-TIME PRODUCT CLICKS */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 md:mb-6 flex items-center gap-2 text-primary">
                        <MousePointer className="h-5 w-5" />
                        <h2 className="font-serif text-lg md:text-xl font-semibold">Live Product Clicks</h2>
                    </div>

                    {productClicks.length === 0 ? (
                        <p className="text-xs md:text-sm text-muted-foreground py-4 text-center">No product clicks recorded yet.</p>
                    ) : (
                        <div className="divide-y divide-border">
                            {productClicks.map((item) => (
                                <div key={item._id} className="flex items-center justify-between py-3 gap-2">
                                    <span className="font-medium text-foreground text-xs md:text-sm line-clamp-1">{item._id}</span>
                                    <span className="rounded-full bg-secondary px-2.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold text-primary shrink-0">
                                        {item.clicks} {item.clicks === 1 ? "Click" : "Clicks"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Card 4: CHECKOUT INTENT LOG */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 md:mb-6 flex items-center gap-2 text-primary">
                        <ShoppingBag className="h-5 w-5" />
                        <h2 className="font-serif text-lg md:text-xl font-semibold">Live Checkout Log</h2>
                    </div>

                    {checkoutIntents.length === 0 ? (
                        <p className="text-xs md:text-sm text-muted-foreground py-4 text-center">No checkout views recorded yet.</p>
                    ) : (
                        <div className="divide-y divide-border">
                            {checkoutIntents.map((item) => (
                                <div key={item._id} className="flex items-center justify-between py-3 gap-2">
                                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                                        {item.completed ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                        )}
                                        <span className={`font-medium text-xs md:text-sm truncate ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {item.productName}
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-secondary/70 px-2.5 py-0.5 md:px-2.5 md:py-1 text-[9px] md:text-[10px] font-medium text-muted-foreground shrink-0">
                                        {getTimeAgo(item.timestamp)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}