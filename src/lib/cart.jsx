import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
const KEY = "loomzo_cart";

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch { }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
    }, [items, hydrated]);

    const add = (p) =>
        setItems((prev) => {
            const existing = prev.find((i) => i.product.id === p.id);
            if (existing) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i));
            return [...prev, { product: p, qty: 1 }];
        });

    const remove = (id) => setItems((prev) => prev.filter((i) => i.product.id !== id));

    const setQty = (id, qty) =>
        setItems((prev) => (qty <= 0 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, qty } : i))));

    const clear = () => setItems([]);

    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);

    return (
        <Ctx.Provider value={{ items, add, remove, setQty, clear, count, total }}>
            {children}
        </Ctx.Provider>
    );
}

export function useCart() {
    const c = useContext(Ctx);
    if (!c) throw new Error("useCart outside provider");
    return c;
}