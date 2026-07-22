import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CheckCircle2, XCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMins = Math.floor((now - past) / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
};

export function AdminCheckouts() {
    const [checkouts, setCheckouts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/track/checkout-intents`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.checkoutIntents) {
                    setCheckouts(data.checkoutIntents);
                }
            })
            .catch(err => console.error("Error fetching checkouts:", err));

        const socket = io(API_URL);

        socket.on("admin:realtime_event", (newEvent) => {
            if (newEvent.eventType === "checkout_view") {
                setCheckouts((prev) => {
                    const newItem = {
                        _id: newEvent._id,
                        orderId: newEvent._id.slice(-4).toUpperCase(),
                        productName: newEvent.productName,
                        sessionId: newEvent.sessionId,
                        timestamp: newEvent.timestamp,
                        completed: false,
                        customerName: "N/A (Draft)",
                        whatsapp: "N/A"
                    };
                    return [newItem, ...prev];
                });
            }

            if (newEvent.eventType === "checkout_attempt") {
                setCheckouts((prev) => prev.map(c => {
                    if (c.sessionId === newEvent.sessionId && c.productName === newEvent.productName) {
                        return {
                            ...c,
                            completed: true,
                            customerName: newEvent.customerData?.name || "Unknown",
                            whatsapp: newEvent.customerData?.whatsapp || "Unknown",
                        };
                    }
                    return c;
                }));
            }
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="font-serif text-2xl md:text-3xl text-primary">Checkout Table</h1>
            <p className="mt-1 md:mt-2 mb-6 md:mb-8 text-sm md:text-base text-muted-foreground">Monitor real-time abandoned carts and completed COD orders.</p>

            {/* Desktop Table View (Hidden on Small Mobile Screens) */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-secondary/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">WhatsApp</th>
                                <th className="px-6 py-4 font-medium">Product Attempted</th>
                                <th className="px-6 py-4 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {checkouts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-muted-foreground">
                                        No checkout data available yet...
                                    </td>
                                </tr>
                            ) : (
                                checkouts.map((checkout) => (
                                    <tr key={checkout._id} className={`transition-colors hover:bg-secondary/20 ${checkout.completed ? 'bg-emerald-50/10' : ''}`}>
                                        <td className="px-6 py-4">
                                            {checkout.completed ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                                                    <XCircle className="h-3.5 w-3.5" /> Abandoned
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            ORD-{checkout.orderId}
                                        </td>
                                        <td className={`px-6 py-4 capitalize ${checkout.completed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                            {checkout.customerName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {checkout.completed && checkout.whatsapp !== "N/A" ? (
                                                <a href={`https://wa.me/${checkout.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-600 font-medium hover:underline">
                                                    {checkout.whatsapp}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground">{checkout.whatsapp}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-primary font-medium max-w-xs truncate">
                                            {checkout.productName || "Unknown Product"}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {getTimeAgo(checkout.timestamp)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View (Optimized for small screens) */}
            <div className="block md:hidden space-y-3">
                {checkouts.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
                        No checkout data available yet...
                    </div>
                ) : (
                    checkouts.map((checkout) => (
                        <div
                            key={checkout._id}
                            className={`rounded-xl border border-border bg-card p-4 shadow-sm transition-all ${checkout.completed ? 'border-emerald-500/40 bg-emerald-50/5' : ''}`}
                        >
                            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 mb-3">
                                <span className="font-mono text-xs font-semibold text-muted-foreground">
                                    ORD-{checkout.orderId}
                                </span>
                                {checkout.completed ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                                        <CheckCircle2 className="h-3 w-3" /> Completed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800">
                                        <XCircle className="h-3 w-3" /> Abandoned
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Product:</span>
                                    <span className="font-medium text-primary text-right truncate max-w-50">{checkout.productName || "Unknown"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer:</span>
                                    <span className={`capitalize ${checkout.completed ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{checkout.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">WhatsApp:</span>
                                    <span>
                                        {checkout.completed && checkout.whatsapp !== "N/A" ? (
                                            <a href={`https://wa.me/${checkout.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-600 font-medium hover:underline">
                                                {checkout.whatsapp}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground">{checkout.whatsapp}</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                                    <span>Time:</span>
                                    <span>{getTimeAgo(checkout.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}