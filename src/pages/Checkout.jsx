import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SiteNav, SiteFooter } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { useCart } from "../lib/cart";
import { formatINR } from "../lib/products";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { z } from "zod";

const schema = z.object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().email("Invalid email").max(255),
    whatsapp: z.string().trim().min(10, "Enter a valid WhatsApp number").max(15),
    address: z.string().trim().min(10, "Please enter a full address").max(500),
});

export function Checkout() {
    const { items, total, clear } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: "", email: "", whatsapp: "", address: "" });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const place = async (e) => {
        e.preventDefault();
        const parsed = schema.safeParse(form);
        if (!parsed.success) {
            toast.error(parsed.error.issues[0].message);
            return;
        }
        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        setSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccess(true);
            clear();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not place order");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteNav />
            {/* Main fade-in */}
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-12 md:px-8 md:pt-16 animate-in fade-in duration-700 ease-out">

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="font-serif text-4xl text-primary md:text-5xl">Checkout</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Pay with Cash on Delivery. Our team will confirm on WhatsApp.</p>
                </div>

                {/* Added mb-28 on mobile to ensure the grid pushes the scroll boundary down */}
                <div className="mt-8 mb-28 md:mb-16 grid gap-8 lg:grid-cols-[1fr_400px]">
                    <form
                        onSubmit={place}
                        className="space-y-5 rounded-2xl bg-card p-6 ring-1 ring-border md:p-8 animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both"
                        style={{ animationDelay: "100ms" }}
                    >
                        <h2 className="font-serif text-2xl text-primary">Shipping details</h2>
                        <div>
                            <Label htmlFor="fullName">Full name</Label>
                            <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1.5 transition-colors" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 transition-colors" />
                            </div>
                            <div>
                                <Label htmlFor="whatsapp">WhatsApp number</Label>
                                <Input id="whatsapp" required placeholder="+91 98XXXXXXXX" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="mt-1.5 transition-colors" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="address">Full shipping address</Label>
                            <Textarea id="address" required rows={4} placeholder="House / Flat No., Street, City, State, PIN Code" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1.5 transition-colors" />
                        </div>
                        <Button type="submit" size="lg" disabled={submitting || items.length === 0} className="w-full shadow-(--shadow-luxe) transition-transform active:scale-95">
                            {submitting ? "Placing order…" : "Complete Order (Cash on Delivery)"}
                        </Button>
                    </form>

                    {/* Changed h-fit to h-auto on mobile (lg:h-fit) to prevent bounding box clipping on iOS/mobile browsers */}
                    <aside
                        className="h-auto lg:h-fit rounded-2xl bg-card p-6 ring-1 ring-border animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both"
                        style={{ animationDelay: "250ms" }}
                    >
                        <h2 className="font-serif text-2xl text-primary">Order summary</h2>
                        {items.length === 0 ? (
                            <p className="mt-4 text-sm text-muted-foreground">Your cart is empty. <Link to="/shop" className="text-primary underline">Continue shopping</Link>.</p>
                        ) : (
                            <>
                                <ul className="mt-4 space-y-3">
                                    {items.map(({ product, qty }) => (
                                        <li key={product.id} className="flex gap-3">
                                            <img src={product.image} alt={product.name} className="h-16 w-14 rounded-md object-cover" />
                                            <div className="flex-1 text-sm">
                                                <p className="font-medium text-primary">{product.name}</p>
                                                <p className="text-muted-foreground">Qty {qty}</p>
                                            </div>
                                            <p className="text-sm font-semibold">{formatINR(product.price * qty)}</p>
                                        </li>
                                    ))}
                                </ul>
                                <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                                    <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(total)}</dd></div>
                                    <div className="flex justify-between text-muted-foreground"><dt>Shipping</dt><dd>Free</dd></div>
                                    <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
                                </dl>
                            </>
                        )}
                    </aside>
                </div>

                {/* Invisible physical spacer explicitly clearing the mobile fixed bottom nav */}
                <div className="h-28 w-full block md:hidden shrink-0" aria-hidden="true" />
            </main>
            <SiteFooter />

            <Dialog open={success} onOpenChange={setSuccess}>
                <DialogContent className="max-w-md text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                        <CheckCircle2 className="h-9 w-9 text-primary" />
                    </div>
                    <h2 className="mt-4 font-serif text-3xl text-primary">Thank you!</h2>
                    <p className="mt-2 text-muted-foreground">Your order is confirmed. Our team will contact you on WhatsApp shortly with dispatch details.</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
                        <MessageCircle className="h-4 w-4 text-accent" /> Expect a message within a few hours
                    </div>
                    <div className="mt-6 flex justify-center gap-2">
                        <Button asChild><Link to="/">Back to home</Link></Button>
                        <Button asChild variant="outline"><Link to="/shop">Keep shopping</Link></Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}