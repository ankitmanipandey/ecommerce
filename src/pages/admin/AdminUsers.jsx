import { useEffect, useState } from "react";
import { UserCircle, Mail, Calendar, ShieldCheck, Phone } from "lucide-react";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/users`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchUsers();
        }
    }, [token]);

    // Reusable Date Formatter
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="font-serif text-3xl text-primary">Registered Users</h1>
            <p className="mt-2 mb-8 text-muted-foreground">Manage and view all registered accounts.</p>

            {isLoading ? (
                <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card">
                    Loading users...
                </div>
            ) : users.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card">
                    No registered users found.
                </div>
            ) : (
                <>
                    {/* MOBILE VIEW: Cards (Hidden on medium screens and up) */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {users.map((user) => (
                            <div key={user._id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <div className="flex items-center gap-3 font-medium capitalize text-foreground">
                                        <UserCircle className="h-5 w-5 text-muted-foreground" />
                                        {user.name || user.email.split('@')[0]}
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "admin"
                                        ? "bg-primary/10 text-primary"
                                        : "bg-secondary text-foreground"
                                        }`}>
                                        {user.role === "admin" && <ShieldCheck className="h-3 w-3" />}
                                        {user.role}
                                    </span>
                                </div>
                                <div className="space-y-2.5 text-sm text-foreground">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.mobile || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Joined {formatDate(user.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP VIEW: Table (Hidden on small screens) */}
                    <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-secondary/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Mobile</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map((user) => (
                                        <tr key={user._id} className="transition-colors hover:bg-secondary/20">
                                            <td className="px-6 py-4 text-foreground capitalize flex items-center gap-3 font-medium">
                                                <UserCircle className="h-5 w-5 text-muted-foreground" />
                                                {user.name || user.email.split('@')[0]}
                                            </td>
                                            <td className="px-6 py-4 text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    {user.mobile || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "admin"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-secondary text-foreground"
                                                    }`}>
                                                    {user.role === "admin" && <ShieldCheck className="h-3 w-3" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}