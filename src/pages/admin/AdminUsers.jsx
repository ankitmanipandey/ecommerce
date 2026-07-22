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

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="font-serif text-3xl text-primary">Registered Users</h1>
            <p className="mt-2 mb-8 text-muted-foreground">Manage and view all registered accounts.</p>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted-foreground">
                                        No registered users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
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
                                                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}