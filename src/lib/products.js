import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";
import p5 from "../assets/p5.png";
import p6 from "../assets/p6.png";

export const categories = [
    { name: "Youth & Trend", tagline: "Pastels, Organza" },
    { name: "Festive & Bridal", tagline: "Deep Silks, Zari work" },
    { name: "Timeless Elegance", tagline: "Subtle Handlooms, Cotton Silk" },
];

export const products = [
    { id: "1", name: "Pastel Blossom Organza", category: "Youth & Trend", price: 1299, image: p1, description: "A whisper-soft organza saree in blush pink with hand-embroidered floral motifs. Made for garden brunches and golden hour laughter." },
    { id: "2", name: "Mint Green Chiffon Drape", category: "Youth & Trend", price: 999, image: p2, description: "Featherlight chiffon in a fresh mint hue with a shimmering silver border. Effortless drape, endless charm." },
    { id: "3", name: "Royal Maroon Litchi Silk", category: "Festive & Bridal", price: 3499, image: p3, description: "Regal maroon litchi silk with intricate gold zari motifs. A statement piece for weddings and celebrations." },
    { id: "4", name: "Emerald Banarasi Brocade", category: "Festive & Bridal", price: 4299, image: p4, description: "Handwoven Banarasi brocade in emerald green with traditional gold zari work. Timeless heirloom-quality craftsmanship." },
    { id: "5", name: "Classic Ivory Cotton Silk", category: "Timeless Elegance", price: 6999, image: p5, description: "Pure ivory cotton silk with a delicate golden temple border. Understated elegance woven by master artisans." },
    { id: "6", name: "Midnight Blue Khaddi Georgette", category: "Timeless Elegance", price: 8499, image: p6, description: "Rich midnight blue khaddi georgette adorned with hand-embroidered silver motifs. Poised and poetic." },
];

export const findProduct = (id) => products.find((p) => p.id === id);

export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;