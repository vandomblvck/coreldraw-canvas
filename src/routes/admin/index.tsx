import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { createTransfer, deleteTransfer, listTransfers, updateTransfer } from "@/lib/transfers.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [
    { title: "Admin Panel | Western Union" },
    { name: "description", content: "Manage money transfers and tracking statuses." },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminPanel,
});

type Transfer = {
  id: string;
  mtcn: string;
  sender_first_name: string;
  sender_last_name: string;
  sender_phone: string;
  receiver_first_name: string;
  receiver_last_name: string;
  receiver_country: string;
  send_amount: number;
  send_currency: string;
  receive_amount: number | null;
  receive_currency: string | null;
  status: string;
  status_detail: string;
  created_at: string;
};

const STATUSES = ["In progress", "Available for pickup", "On hold", "Completed", "Cancelled"];

const emptyForm = {
  sender_first_name: "", sender_last_name: "", sender_phone: "",
  receiver_first_name: "", receiver_last_name: "", receiver_country: "United States",
  send_amount: "", send_currency: "USD", receive_amount: "", receive_currency: "",
  status: "In progress", status_detail: "",
};

function AdminPanel() {
  const navigate = useNavigate();
  const fetchTransfers = useServerFn(listTransfers);
  const createFn = useServerFn(createTransfer);
  const updateFn = useServerFn(updateTransfer);
  const deleteFn = useServerFn(deleteTransfer);
  const [ready, setReady] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      setTransfers((await fetchTransfers()) as Transfer[]);
    } catch {
      navigate({ to: "/admin/login" });
    }
  };

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/admin/login" }); return; }
      const { data: roleRow } = await supabase
        .from("user_roles").select("role").eq("role", "admin").maybeSingle();
      if (!roleRow) { navigate({ to: "/admin/login" }); return; }
      setReady(true);
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createFn({
        data: {
          sender_first_name: form.sender_first_name.trim(),
          sender_last_name: form.sender_last_name.trim(),
          sender_phone: form.sender_phone.trim(),
          receiver_first_name: form.receiver_first_name.trim(),
          receiver_last_name: form.receiver_last_name.trim(),
          receiver_country: form.receiver_country,
          send_amount: Number(form.send_amount) || 0,
          send_currency: form.send_currency.trim() || "USD",
          receive_amount: form.receive_amount ? Number(form.receive_amount) : null,
          receive_currency: form.receive_currency.trim() || null,
          status: form.status,
          status_detail: form.status_detail.trim(),
        },
      });
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transfer.");
    }
    setSaving(false);
  };

  const onStatusChange = async (id: string, status: string) => {
    await updateFn({ data: { id, updates: { status } } });
    await load();
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this transfer permanently?")) return;
    await deleteFn({ data: { id } });
    await load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (!ready) return <main className="admin-page"><p className="admin-loading">Loading…</p></main>;

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <h1>Transfer Admin</h1>
        <div className="admin-topbar-actions">
          <Button className="admin-primary-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close form" : "New transfer"}
          </Button>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </header>

      {showForm && (
        <form className="admin-create-card" onSubmit={onCreate}>
          <h2>Create transfer <span>(MTCN is generated automatically)</span></h2>
          <div className="admin-grid">
            <label className="admin-field"><span>Sender first name *</span><input required value={form.sender_first_name} onChange={set("sender_first_name")} /></label>
            <label className="admin-field"><span>Sender last name</span><input value={form.sender_last_name} onChange={set("sender_last_name")} /></label>
            <label className="admin-field"><span>Sender phone</span><input value={form.sender_phone} onChange={set("sender_phone")} /></label>
            <label className="admin-field"><span>Receiver first name</span><input value={form.receiver_first_name} onChange={set("receiver_first_name")} /></label>
            <label className="admin-field"><span>Receiver last name</span><input value={form.receiver_last_name} onChange={set("receiver_last_name")} /></label>
            <label className="admin-field"><span>Receiver country</span><input value={form.receiver_country} onChange={set("receiver_country")} /></label>
            <label className="admin-field"><span>Send amount *</span><input required inputMode="decimal" value={form.send_amount} onChange={set("send_amount")} /></label>
            <label className="admin-field"><span>Send currency</span><input value={form.send_currency} onChange={set("send_currency")} /></label>
            <label className="admin-field"><span>Receive amount</span><input inputMode="decimal" value={form.receive_amount} onChange={set("receive_amount")} /></label>
            <label className="admin-field"><span>Receive currency</span><input value={form.receive_currency} onChange={set("receive_currency")} /></label>
            <label className="admin-field"><span>Status</span>
              <select value={form.status} onChange={set("status")}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            </label>
            <label className="admin-field admin-field-wide"><span>Status detail (shown to customer)</span><input value={form.status_detail} onChange={set("status_detail")} /></label>
          </div>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <Button type="submit" className="admin-primary-btn" disabled={saving}>{saving ? "Creating…" : "Create transfer"}</Button>
        </form>
      )}

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>MTCN</th><th>Sender</th><th>Receiver</th><th>Country</th><th>Amount</th><th>Status</th><th>Created</th><th></th></tr>
          </thead>
          <tbody>
            {transfers.length === 0 && <tr><td colSpan={8} className="admin-empty">No transfers yet — create one above.</td></tr>}
            {transfers.map((t) => (
              <tr key={t.id}>
                <td className="admin-mtcn">{t.mtcn}</td>
                <td>{t.sender_first_name} {t.sender_last_name}</td>
                <td>{t.receiver_first_name} {t.receiver_last_name}</td>
                <td>{t.receiver_country}</td>
                <td>{t.send_amount} {t.send_currency}</td>
                <td>
                  <select value={t.status} onChange={(e) => onStatusChange(t.id, e.target.value)} aria-label="Transfer status">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                <td><button type="button" className="admin-delete" onClick={() => onDelete(t.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
