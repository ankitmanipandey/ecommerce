import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Activity, Clock } from "lucide-react";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const formatTimeOnSite = (joinTime, endTime) => {
    const diffMs = endTime - joinTime;
    const totalSeconds = Math.floor(diffMs / 1000);
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

const getStatusText = (path, productName) => {
    if (path === "/checkout") return "At Checkout Page";
    if (path.includes("/product/") && productName) return `Viewing: ${productName}`;
    if (path === "/categories") return "Browsing: Categories";
    if (path === "/shop") return "Browsing: Shop";
    if (path === "/cart") return "Viewing Cart";
    if (path === "/") return "Browsing: Home Page";
    return `On path: ${path}`;
};

export function AdminVisitors() {
    const [visitors, setVisitors] = useState([]);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const socket = io(API_URL);

        socket.on("admin:active_users", (allUsers) => {
            setVisitors(allUsers);
        });

        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, []);

    // Filter to count only online users for the top badge
    const onlineCount = visitors.filter(v => v.isOnline).length;

    // Sort users: Online first, then by last seen (offlineAt) ascending
    const sortedVisitors = [...visitors].sort((a, b) => {
        // 1. Online users on top
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;

        // 2. Sort the rest in ascending order
        if (!a.isOnline && !b.isOnline) {
            return a.offlineAt - b.offlineAt; // Ascending based on when they went offline
        }

        // If both are online, sort by join time ascending
        return a.joinTime - b.joinTime;
    });

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="font-serif text-2xl md:text-3xl text-primary">Live Visitors & Logs</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">Real-time traffic and persistent visitor session logs.</p>

            <div className="mt-6 md:mt-8 max-w-3xl rounded-xl border border-border bg-card shadow-sm">

                {/* Header Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border bg-secondary/30 p-4 md:p-6">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm md:text-base">
                        <Activity className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
                        <span>{onlineCount} Active Users Online</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Showing Live & Historical Logs</span>
                </div>

                {/* Visitor Log List */}
                <div className="p-4 md:p-6">
                    {sortedVisitors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Clock className="mb-2 h-8 w-8 opacity-20" />
                            <p className="text-sm">No visitor history logged yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 md:space-y-4">
                            {sortedVisitors.map((user) => (
                                <div
                                    key={user.socketId}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4 shadow-sm transition-all ${user.isOnline
                                        ? "border-emerald-500/30 bg-background"
                                        : "border-border/40 bg-secondary/20 opacity-75"
                                        }`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-foreground text-sm md:text-base">{user.location}</p>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${user.isOnline ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                                                }`}>
                                                {user.isOnline ? "ONLINE" : "OFFLINE"}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm text-primary/80 mt-1">
                                            {getStatusText(user.path, user.productName)}
                                        </p>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0 text-xs md:text-sm">
                                        <p className="text-muted-foreground">
                                            {user.isOnline ? "Time on site" : "Total session"}
                                        </p>
                                        <p className="font-medium sm:mt-1">
                                            {formatTimeOnSite(user.joinTime, user.isOnline ? now : user.offlineAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}