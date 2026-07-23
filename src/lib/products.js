import p1 from "../assets/p1.png";
import hero2 from "../assets/hero2.jpg";
import hero from "../assets/hero.jpg";
import hero3 from "../assets/hero3.jpg";
import p5 from "../assets/p5.png";
import p6 from "../assets/p6.png";
import p7 from "../assets/p7.png";
import p8 from "../assets/p8.png";
import p9 from "../assets/p9.png";
import p10 from "../assets/p10.png";
import p11 from "../assets/p11.png";
import p12 from "../assets/p12.png";
import p13 from "../assets/p13.png";
import p14 from "../assets/p14.png";

export const categories = [
    { name: "Youth & Trend", tagline: "Pastels, Organza" },
    { name: "Festive & Bridal", tagline: "Deep Silks, Zari work" },
    { name: "Timeless Elegance", tagline: "Subtle Handlooms, Cotton Silk" },
];

export const products = [
    { id: "1", name: "Pastel Blossom Organza", category: "Youth & Trend", price: 1299, image: p1, description: "A whisper-soft organza saree in blush pink with hand-embroidered floral motifs. Made for garden brunches and golden hour laughter." },
    { id: "2", name: "Mint Green Chiffon Drape", category: "Youth & Trend", price: 999, image: hero2, description: "Featherlight chiffon in a fresh mint hue with a shimmering silver border. Effortless drape, endless charm." },
    { id: "3", name: "Royal Maroon Litchi Silk", category: "Festive & Bridal", price: 3499, image: hero, description: "Regal maroon litchi silk with intricate gold zari motifs. A statement piece for weddings and celebrations." },
    { id: "4", name: "Emerald Banarasi Brocade", category: "Festive & Bridal", price: 4299, image: hero3, description: "Handwoven Banarasi brocade in emerald green with traditional gold zari work. Timeless heirloom-quality craftsmanship." },
    { id: "5", name: "Classic Ivory Cotton Silk", category: "Timeless Elegance", price: 6999, image: p5, description: "Pure ivory cotton silk with a delicate golden temple border. Understated elegance woven by master artisans." },
    { id: "6", name: "Midnight Blue Khaddi Georgette", category: "Timeless Elegance", price: 8499, image: p6, description: "Rich midnight blue khaddi georgette adorned with hand-embroidered silver motifs. Poised and poetic." },
    { id: "p7-khaddi-georgette", name: "Red Khaddi Georgette Banarasi", category: "Youth & Trend", price: 1999, image: p7, description: "A beautifully draped Red Khaddi Georgette Banarasi saree, perfect for a modern, youthful aesthetic. Lightweight, vibrant, and effortlessly elegant with intricate zari details." },
    { id: "p8-lavendar-silver-banarasi", name: "Lavender Silver-Zari Banarasi", category: "Youth & Trend", price: 2499, image: p8, description: "Minimalist silver floral motifs and a delicate scalloped edge create a fresh, contemporary evening look on this lightweight Banarasi drape." },
    { id: "p9-powder-blue-banarasi-drape", name: "Powder Blue Banarasi Drape", category: "Youth & Trend", price: 1999, image: p9, description: "Flowy drape with delicate tassels and spaced-out zari butis. A pastel dream for daylight celebrations and aesthetic photoshoots." },
    { id: "p10-rose-gold-shimmer-banarasi", name: "Rose Gold Shimmer Banarasi", category: "Youth & Trend", price: 1499, image: p10, description: "A subtle metallic sheen over a solid body with a sleek border, perfect for the modern minimalist aesthetic." },
    { id: "p11-kanjivaram-silk", name: "Kanjivaram (Kanchipuram) Silk", category: "Festive & Bridal", price: 2499, image: p11, description: "An heirloom woven in time, this majestic Kanjivaram silk saree boasts a rich, lustrous drape and traditional zari motifs. Exuding timeless grace and regal charm, this luxurious piece is the quintessential choice for bridal trousseaus, grand pujas, and unforgettable festive celebrations." },
    {
        id: "p12-mustard-tussar-brocade",
        name: "Mustard Yellow Tussar Brocade",
        category: "Festive & Bridal",
        price: 2499,
        image: p12,
        description: "Embrace the warmth of festive traditions with this Mustard Yellow Tussar Brocade saree. Featuring a refined matte texture and subtle copper zari butis, this handwoven masterpiece offers a breathable yet luxurious drape. A flawless choice for daytime pujas, haldi ceremonies, and elegant cultural gatherings."
    },
    {
        id: "p13-royal-blue-meenakari",
        name: "Royal Blue Meenakari Saree",
        category: "Festive & Bridal",
        price: 1299,
        image: p13,
        description: "Exude royal elegance in this breathtaking Royal Blue Meenakari saree. Woven from luxurious, soft-draping Chiniya silk, it features vibrant, enamel-like meenakari colors beautifully intertwined with classic gold zari motifs. A majestic and timeless addition to any festive wardrobe or bridal trousseau."
    },
    {
        id: "p14-ruby-red-bridal-silk",
        name: "Ruby Red Classic Bridal Silk",
        category: "Festive & Bridal",
        price: 3499,
        image: p14,
        description: "A quintessential masterpiece for grand celebrations, this Ruby Red Classic Bridal Silk saree exudes timeless grandeur. Crafted from pure, heavy silk, it features a rich, solid red body complemented by a meticulously woven, heavy traditional gold zari pallu and temple border. A true heirloom investment that honors cultural heritage and sophisticated grace."
    }

];

export const findProduct = (id) => products.find((p) => p.id === id);

export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;