import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ecoencypt/admin/login")({
  head: () => ({ meta: [
    { title: "Admin Login | Western Union" },
    { name: "description", content: "Administrator sign in for transfer management." },
    { name: "robots", content: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
  ] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      setError("Invalid email or password.");
      return;
    }
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .maybeSingle();
    setLoading(false);
    if (!roleRow) {
      await supabase.auth.signOut();
      setError("This account does not have admin access.");
      return;
    }
    navigate({ to: "/ecoencypt/admin" });
  };

  return (
    <main className="admin-auth-page">
      <form className="admin-auth-card" onSubmit={onSubmit}>
        <h1>Admin Login</h1>
        <p className="admin-auth-sub">Transfer management access</p>
        <label className="admin-field">
          <span>Email</span>
          <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <Button type="submit" className="admin-primary-btn" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </main>
  );
}