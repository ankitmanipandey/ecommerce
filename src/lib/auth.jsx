import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext({ user: null, session: null, loading: true, isAdmin: false });

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Simulated authentication check since Supabase is removed
        const checkAuth = async () => {
            setLoading(true);

            // Simulate a brief network delay (optional, can be removed)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Set default unauthenticated state
            setSession(null);
            setIsAdmin(false);
            setLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <Ctx.Provider value={{ user: session?.user ?? null, session, loading, isAdmin }}>
            {children}
        </Ctx.Provider>
    );
}

export const useAuth = () => useContext(Ctx);