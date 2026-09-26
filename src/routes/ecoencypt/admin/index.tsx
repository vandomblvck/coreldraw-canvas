import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, List, Plus, History, Settings, LogOut, Menu, X, Copy, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { adminOverview, createTransfer, getAdminTransfer, searchAdminTransfers, updateTransfer } from "@/lib/transfers.functions";
import { countries } from "@/lib/countries";
import type { Tables } from "@/integrations/supabase/types";

type Transfer = Tables<"transfers">;
type View = "Dashboard" | "Transfers" | "Create Transfer" | "Transfer History" | "Settings" | "Details" | "Success";
const statuses = ["Sent", "In progress", "Delivered", "On hold", "Cancelled"];
const navigation = [
  { name: "Dashboard", icon: LayoutDashboard }, { name: "Transfers", icon: List },
  { name: "Create Transfer", icon: Plus }, { name: "Transfer History", icon: History },
  { name: "Settings", icon: Settings },
] as const;
const initialForm = { sender_first_name: "", sender_last_name: "", sender_phone: "", receiver_first_name: "", receiver_last_name: "", receiver_country: "United States", send_amount: "", send_currency: "USD", receive_amount: "", receive_currency: "", status: "Sent", status_detail: "", delivery_method: "Bank transfer" };
const label = (value: string) => value === "Completed" ? "Delivered" : value;
const date = (value: string) => new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const money = (value: Transfer) => `${Number(value.send_amount).toLocaleString()} ${value.send_currency}`;

export const Route = createFileRoute("/ecoencypt/admin/")({
  head: () => ({ meta: [
    { title: "Transfer Dashboard | Western Union" }, { name: "description", content: "Secure transfer management dashboard." },
    { property: "og:title", content: "Transfer Dashboard | Western Union" }, { property: "og:description", content: "Secure transfer management dashboard." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminPanel,
});

function AdminPanel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const overviewFn = useServerFn(adminOverview);
  const searchFn = useServerFn(searchAdminTransfers);
  const detailsFn = useServerFn(getAdminTransfer);
  const createFn = useServerFn(createTransfer);
  const updateFn = useServerFn(updateTransfer);
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState("");
  const [view, setView] = useState<View>("Dashboard");
  const [drawer, setDrawer] = useState(false);
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof adminOverview>> | null>(null);
  const [listing, setListing] = useState<Awaited<ReturnType<typeof searchAdminTransfers>> | null>(null);
  const [details, setDetails] = useState<Awaited<ReturnType<typeof getAdminTransfer>> | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [createdMtcn, setCreatedMtcn] = useState("");
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [statusDetail, setStatusDetail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) { navigate({ to: "/ecoencypt/admin/login" }); return; }
      try {
        const result = await overviewFn();
        if (active) { setAccount(user.email ?? "Admin"); setOverview(result); setReady(true); }
      } catch { if (active) navigate({ to: "/ecoencypt/admin/login" }); }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready || (view !== "Transfers" && view !== "Transfer History")) return;
    let active = true;
    setLoading(true);
    searchFn({ data: { page, search, status: filter } }).then(result => { if (active) { setListing(result); setLoading(false); } }).catch(() => { if (active) { setError("Unable to load transfers."); setLoading(false); } });
    return () => { active = false; };
  }, [ready, view, search, filter, page, notice]);

  const refresh = async () => { setOverview(await overviewFn()); setNotice("Updated successfully."); };
  const changeView = (next: View) => { setView(next); setDrawer(false); setError(""); setNotice(""); setPage(0); };
  const openDetails = async (id: string) => {
    setLoading(true); setError(""); setSelectedId(id); setView("Details");
    try { const result = await detailsFn({ data: { id } }); setDetails(result); setStatus(result.transfer?.status ?? ""); setStatusDetail(result.transfer?.status_detail ?? ""); }
    catch { setError("Unable to load transfer details."); }
    setLoading(false);
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const row = await createFn({ data: { ...form, send_amount: Number(form.send_amount), receive_amount: form.receive_amount ? Number(form.receive_amount) : null, receive_currency: form.receive_currency || null } });
      setCreatedMtcn(row.mtcn); setForm(initialForm); setView("Success"); setOverview(await overviewFn());
    } catch { setError("Unable to create transfer. Please check the fields and try again."); }
    setBusy(false);
  };
  const saveStatus = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selectedId || !details?.transfer) return;
    setBusy(true); setError("");
    try {
      await updateFn({ data: { id: selectedId, updates: { status, status_detail: statusDetail } } });
      setDetails(await detailsFn({ data: { id: selectedId } })); await refresh();
    } catch { setError("Status could not be updated. Please try again."); }
    setBusy(false);
  };
  const copy = async (mtcn: string) => { try { await navigator.clipboard.writeText(mtcn); setNotice("MTCN copied."); } catch { setError("Copy failed. Please select the MTCN manually."); } };
  const signOut = async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); navigate({ to: "/ecoencypt/admin/login", replace: true }); };
  const field = (name: keyof typeof initialForm, title: string, required = false, type = "text") => <label className="admin-field" key={name}><span>{title}{required ? " *" : ""}</span><input required={required} type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "any" : undefined} value={form[name]} onChange={e => setForm(previous => ({ ...previous, [name]: e.target.value }))} /></label>;

  const rows = (items: Transfer[]) => items.length ? <>
    <div className="admin-desktop-table"><table className="admin-data-table"><thead><tr><th>MTCN</th><th>Sender</th><th>Receiver</th><th>Amount</th><th>Currency</th><th>Status</th><th>Delivery method</th><th>Created</th><th>Actions</th></tr></thead><tbody>{items.map(t => <tr key={t.id}><td className="admin-mtcn">{t.mtcn}</td><td>{t.sender_first_name} {t.sender_last_name}</td><td>{t.receiver_first_name} {t.receiver_last_name}</td><td>{Number(t.send_amount).toLocaleString()}</td><td>{t.send_currency}</td><td><span className="admin-status">{label(t.status)}</span></td><td>{t.delivery_method}</td><td>{date(t.created_at)}</td><td><Button variant="outline" onClick={() => openDetails(t.id)}>View</Button></td></tr>)}</tbody></table></div>
    <div className="admin-mobile-list">{items.map(t => <article className="admin-transfer-card" key={t.id}><div className="admin-card-top"><div><span className="admin-caption">MTCN</span><strong className="admin-mtcn">{t.mtcn}</strong></div><span className="admin-status">{label(t.status)}</span></div><div className="admin-card-details"><div><span className="admin-caption">Sender</span><b>{t.sender_first_name} {t.sender_last_name}</b></div><div><span className="admin-caption">Receiver</span><b>{t.receiver_first_name} {t.receiver_last_name}</b></div><div><span className="admin-caption">Amount</span><b>{money(t)}</b></div><div><span className="admin-caption">Created</span><b>{date(t.created_at)}</b></div></div><Button variant="outline" className="admin-card-view" onClick={() => openDetails(t.id)}>View transfer <ArrowRight size={17} /></Button></article>)}</div>
  </> : <div className="admin-empty">No transfers found.</div>;

  if (!ready) return <main className="admin-page"><p className="admin-loading">Loading dashboard…</p></main>;
  const heading = view === "Details" ? "Transfer details" : view === "Success" ? "Transfer created" : view === "Create Transfer" ? "Create new transfer" : view;
  return <main className="admin-app">
    {drawer && <button className="admin-backdrop" aria-label="Close menu" onClick={() => setDrawer(false)} />}
    <aside className={`admin-sidebar ${drawer ? "admin-sidebar-open" : ""}`} aria-label="Admin navigation">
      <div className="admin-sidebar-brand"><span className="admin-brand-mark">WU</span><span>Transfer Admin</span><Button variant="ghost" className="admin-drawer-close" aria-label="Close menu" onClick={() => setDrawer(false)}><X size={22} /></Button></div>
      <nav>{navigation.map(({ name, icon: Icon }) => <Button key={name} variant="ghost" className={`admin-nav-item ${view === name || (name === "Transfers" && view === "Details") ? "admin-nav-active" : ""}`} onClick={() => changeView(name)}><Icon size={20} />{name}</Button>)}</nav>
      <Button variant="ghost" className="admin-nav-item admin-signout" onClick={signOut}><LogOut size={20} /> Sign out</Button>
    </aside>
    <div className="admin-main">
      <header className="admin-dashboard-topbar"><div className="admin-topbar-title"><Button variant="ghost" className="admin-menu-toggle" aria-label="Open menu" onClick={() => setDrawer(true)}><Menu size={23} /></Button><div className="admin-title-text"><span>Transfer Admin / {heading}</span><h1>{heading}</h1></div></div><div className="admin-topbar-right"><Button className="admin-primary-btn admin-top-create" onClick={() => changeView("Create Transfer")}><Plus size={18} /> New transfer</Button><span className="admin-avatar" title={account}>Admin</span></div></header>
      <div className="admin-content">
        {error && <p role="alert" className="admin-error admin-alert">{error}</p>}{notice && <p role="status" className="admin-notice">{notice}</p>}
        {view === "Dashboard" && <><div className="admin-section-heading"><div><span className="admin-eyebrow">Transfer management</span><h2>Overview</h2></div><Button variant="outline" onClick={() => changeView("Create Transfer")}><Plus size={18} /> Create transfer</Button></div><div className="admin-stats">{[["Total transfers", overview?.total ?? 0], ["In progress", overview?.inProgress ?? 0], ["Delivered", overview?.delivered ?? 0], ["On hold", overview?.onHold ?? 0], ["Cancelled", overview?.cancelled ?? 0]].map(([title, value]) => <article className="admin-stat" key={title}><span>{title}</span><strong>{value}</strong></article>)}</div><section className="admin-section"><div className="admin-section-heading"><h2>Recent transfers</h2><Button variant="ghost" onClick={() => changeView("Transfers")}>View all <ArrowRight size={18} /></Button></div>{rows(overview?.recent ?? [])}</section></>}
        {(view === "Transfers" || view === "Transfer History") && <section className="admin-section"><div className="admin-section-heading"><div><span className="admin-eyebrow">All records</span><h2>{view}</h2></div><span className="admin-count">{listing?.count ?? 0} transfers</span></div><div className="admin-filters"><label className="admin-search"><Search size={19} /><input aria-label="Search by MTCN, sender or receiver" placeholder="Search MTCN, sender or receiver" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} /></label><select aria-label="Filter by status" value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}>{["All", ...statuses].map(s => <option key={s}>{s}</option>)}</select></div>{loading ? <p className="admin-empty">Loading transfers…</p> : rows(listing?.rows ?? [])}<div className="admin-pagination"><Button variant="outline" disabled={page === 0 || loading} onClick={() => setPage(page - 1)}><ChevronLeft size={18} /> Previous</Button><span>Page {page + 1} of {Math.max(1, Math.ceil((listing?.count ?? 0) / 20))}</span><Button variant="outline" disabled={loading || (page + 1) * 20 >= (listing?.count ?? 0)} onClick={() => setPage(page + 1)}>Next <ChevronRight size={18} /></Button></div></section>}
        {view === "Create Transfer" && <form onSubmit={submit} className="admin-form"><div className="admin-section-heading"><div><span className="admin-eyebrow">New record</span><h2>Create new transfer</h2><p>MTCN is securely generated when you create the transfer.</p></div></div><section className="admin-form-section"><h3>Sender information</h3><div className="admin-form-grid">{field("sender_first_name", "First name", true)}{field("sender_last_name", "Last name")}{field("sender_phone", "Phone number")}</div></section><section className="admin-form-section"><h3>Receiver information</h3><div className="admin-form-grid">{field("receiver_first_name", "First name", true)}{field("receiver_last_name", "Last name", true)}<label className="admin-field"><span>Country *</span><select required value={form.receiver_country} onChange={e => setForm({ ...form, receiver_country: e.target.value })}>{countries.map(c => <option key={c.iso} value={c.name}>{c.name}</option>)}</select></label></div></section><section className="admin-form-section"><h3>Transfer information</h3><div className="admin-form-grid">{field("send_amount", "Send amount", true, "number")}{field("send_currency", "Send currency", true)}{field("receive_amount", "Receive amount", false, "number")}{field("receive_currency", "Receive currency")}{field("delivery_method", "Delivery method", true)}<label className="admin-field"><span>Initial status</span><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><label className="admin-field admin-form-wide"><span>Status description (shown to customer)</span><textarea rows={3} value={form.status_detail} onChange={e => setForm({ ...form, status_detail: e.target.value })} /></label></div></section><Button className="admin-primary-btn admin-submit" type="submit" disabled={busy}>{busy ? "Creating…" : "Create transfer"}</Button></form>}
        {view === "Success" && <section className="admin-success"><span className="admin-eyebrow">Transfer created successfully</span><h2>MTCN</h2><strong className="admin-success-mtcn">{createdMtcn}</strong><p>Give this number to the receiver to track their transfer.</p><div className="admin-success-actions"><Button className="admin-primary-btn" onClick={() => copy(createdMtcn)}><Copy size={18} /> Copy MTCN</Button><Button variant="outline" onClick={() => changeView("Create Transfer")}>Create another</Button></div></section>}
        {view === "Details" && <>{loading && <p className="admin-empty">Loading transfer…</p>}{!loading && details?.transfer && <><Button variant="ghost" className="admin-back" onClick={() => changeView("Transfers")}><ChevronLeft size={19} /> Back to transfers</Button><div className="admin-detail-heading"><div><span className="admin-eyebrow">Transfer details</span><h2>MTCN</h2><strong className="admin-detail-mtcn">{details.transfer.mtcn}</strong></div><Button variant="outline" onClick={() => copy(details.transfer?.mtcn ?? "")}><Copy size={18} /> Copy</Button></div><div className="admin-detail-grid">{[["Status", label(details.transfer.status)], ["Sender", `${details.transfer.sender_first_name} ${details.transfer.sender_last_name}`], ["Receiver", `${details.transfer.receiver_first_name} ${details.transfer.receiver_last_name}`], ["Amount", money(details.transfer)], ["Destination", details.transfer.receiver_country], ["Delivery method", details.transfer.delivery_method], ["Created", date(details.transfer.created_at)], ["Updated", date(details.transfer.updated_at)]].map(([key, value]) => <div key={key}><span className="admin-caption">{key}</span><strong>{value}</strong></div>)}</div><div className="admin-detail-columns"><section className="admin-form-section"><h3>Update status</h3><form onSubmit={saveStatus} className="admin-status-form"><label className="admin-field"><span>Current status</span><select value={status} onChange={e => setStatus(e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><label className="admin-field"><span>Status description (shown to customer)</span><textarea rows={4} value={statusDetail} onChange={e => setStatusDetail(e.target.value)} /></label><Button className="admin-primary-btn" disabled={busy || (status === details.transfer.status && statusDetail === details.transfer.status_detail)} type="submit">{busy ? "Saving…" : "Save status"}</Button></form></section><section className="admin-form-section"><h3>Transfer timeline</h3><ol className="admin-event-list">{details.events.map((event, index) => <li key={event.id}><span className={`admin-event-dot ${index === details.events.length - 1 ? "admin-event-current" : ""}`} /><div><strong>{event.title || label(event.status)}</strong><time>{date(event.created_at)}</time>{event.description && <p>{event.description}</p>}{event.location && <p>{event.location}</p>}</div></li>)}</ol>{details.events.length === 0 && <p>No status history recorded.</p>}</section></div></>}</>}
        {view === "Settings" && <section className="admin-form-section"><h2>Settings</h2><div className="admin-setting-row"><span>Signed in as</span><strong>{account}</strong></div><Button variant="outline" onClick={signOut}><LogOut size={18} /> Sign out</Button></section>}
      </div>
    </div>
  </main>;
}
