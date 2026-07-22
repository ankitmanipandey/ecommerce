import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

let liveSocket = null;
let visitorLocation = "Fetching Location...";

// ⚡ FIX: Use localStorage so it survives page refreshes permanently
const getSessionId = () => {
    let sid = localStorage.getItem("loomzo_sid");
    if (!sid) {
        sid = "sid_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("loomzo_sid", sid);
    }
    return sid;
};

const initLivePresence = async () => {
    if (window.location.pathname.startsWith("/admin")) return null;

    if (liveSocket) return liveSocket;

    liveSocket = io(API_URL);

    let loc = localStorage.getItem("loomzo_location");
    if (!loc) {
        try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            loc = `${data.city}, ${data.region_code || data.region}`;
            localStorage.setItem("loomzo_location", loc);
        } catch (err) {
            loc = "Prayagraj, UP";
        }
    }
    visitorLocation = loc;

    // ⚡ Send the permanent sessionId to the backend
    liveSocket.emit("visitor_join", {
        sessionId: getSessionId(),
        location: visitorLocation,
        joinTime: Date.now(),
        path: window.location.pathname,
        productName: ""
    });

    return liveSocket;
};

export const trackEvent = async (eventType, extraData = {}) => {
    try {
        if (window.location.pathname.startsWith("/admin")) {
            return;
        }

        const socket = await initLivePresence();

        if (socket) {
            socket.emit("visitor_update", {
                sessionId: getSessionId(), // Ensure backend knows who this is
                path: window.location.pathname,
                productName: extraData.productName || ""
            });
        }

        if (eventType === "page_view") {
            // ⚡ FIX: Check localStorage so refreshes don't trigger duplicate page views
            if (localStorage.getItem("loomzo_visit_tracked")) {
                return;
            }
            localStorage.setItem("loomzo_visit_tracked", "true");
        }

        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get("utm_source") || "direct";
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        await fetch(`${API_URL}/api/track/event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventType,
                path: window.location.pathname,
                sessionId: getSessionId(),
                utmSource,
                deviceType: isMobile ? "Mobile" : "Desktop",
                ...extraData,
            }),
        });
    } catch (err) {
        console.warn("Tracking failed quietly:", err);
    }
};