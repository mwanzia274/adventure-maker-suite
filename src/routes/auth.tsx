import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin sign in — Pla2Ride" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <SiteLayout>
      <section className="min-h-[70vh] grid place-items-center py-20">
        <div className="w-full max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-brand-sand grid place-items-center text-brand-green-deep">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-gold">Admin</div>
              <h1 className="font-display text-2xl font-semibold text-brand-green-deep">Sign in</h1>
            </div>
          </div>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-deep">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-deep">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
              />
            </label>
            {err && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" /> <span>{err}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-brand-green-deep transition disabled:opacity-60"
            >
              {loading ? <>Signing in… <Loader2 className="size-4 animate-spin" /></> : "Sign in"}
            </button>
          </form>
          <p className="mt-5 text-[11px] text-muted-foreground">
            Default admin: <code className="text-brand-green-deep">admin@admin.com</code> / <code className="text-brand-green-deep">admin12345</code>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}