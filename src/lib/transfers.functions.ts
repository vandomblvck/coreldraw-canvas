import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const transferInput = z.object({
  sender_first_name: z.string().min(1),
  sender_last_name: z.string().default(""),
  sender_phone: z.string().default(""),
  receiver_first_name: z.string().default(""),
  receiver_last_name: z.string().default(""),
  receiver_country: z.string().default("United States"),
  send_amount: z.number().nonnegative().default(0),
  send_currency: z.string().default("USD"),
  receive_amount: z.number().nonnegative().nullable().default(null),
  receive_currency: z.string().nullable().default(null),
  status: z.string().default("In progress"),
  status_detail: z.string().default(""),
  delivery_method: z.string().default("Bank transfer"),
});

async function requireAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin access required");
}

// Public tracking lookup — returns limited, non-sensitive fields only.
export const trackTransfer = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ mtcn: z.string().regex(/^\d{10}$/), firstName: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("transfers")
      .select("id, mtcn, sender_first_name, status, status_detail")
      .eq("mtcn", data.mtcn)
      .maybeSingle();
    if (!row) return { found: false as const };
    if (row.sender_first_name.trim().toLowerCase() !== data.firstName.trim().toLowerCase()) {
      return { found: false as const };
    }
    const { data: history, error } = await supabaseAdmin
      .from("transfer_events")
      .select("status, title, description, created_at")
      .eq("transfer_id", row.id)
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) throw new Error("Transfer history is temporarily unavailable.");
    return { found: true as const, transfer: {
      mtcn: row.mtcn,
      status: row.status,
      status_detail: row.status_detail,
      events: history ?? [],
    } };
  });

export const listTransfers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("transfers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const statuses = ["In progress", "Delivered", "Completed", "On hold", "Cancelled"];
    const counts = await Promise.all([
      context.supabase.from("transfers").select("id", { count: "exact", head: true }),
      ...statuses.map(status => context.supabase.from("transfers").select("id", { count: "exact", head: true }).eq("status", status)),
    ]);
    if (counts.some(result => result.error)) throw new Error("Unable to load transfer statistics.");
    const { data: recent, error } = await context.supabase.from("transfers").select("*").order("created_at", { ascending: false }).limit(8);
    if (error) throw new Error("Unable to load recent transfers.");
    return { total: counts[0]?.count ?? 0, inProgress: counts[1]?.count ?? 0, delivered: (counts[2]?.count ?? 0) + (counts[3]?.count ?? 0), onHold: counts[4]?.count ?? 0, cancelled: counts[5]?.count ?? 0, recent: recent ?? [] };
  });

export const searchAdminTransfers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ page: z.number().int().min(0).default(0), search: z.string().max(80).default(""), status: z.string().max(40).default("All") }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    let query = context.supabase.from("transfers").select("*", { count: "exact" });
    if (data.status !== "All") query = data.status === "Delivered" ? query.in("status", ["Delivered", "Completed"]) : query.eq("status", data.status);
    const search = data.search.trim().replace(/[^\p{L}\p{N} -]/gu, "");
    if (search) query = query.or(`mtcn.ilike.%${search}%,sender_first_name.ilike.%${search}%,sender_last_name.ilike.%${search}%,receiver_first_name.ilike.%${search}%,receiver_last_name.ilike.%${search}%`);
    const { data: rows, count, error } = await query.order("created_at", { ascending: false }).range(data.page * 20, data.page * 20 + 19);
    if (error) throw new Error("Unable to load transfers.");
    return { rows: rows ?? [], count: count ?? 0 };
  });

export const getAdminTransfer = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const [transferResult, eventsResult] = await Promise.all([
      context.supabase.from("transfers").select("*").eq("id", data.id).maybeSingle(),
      context.supabase.from("transfer_events").select("id, status, title, description, location, created_at").eq("transfer_id", data.id).order("created_at", { ascending: true }).limit(100),
    ]);
    if (transferResult.error || eventsResult.error) throw new Error("Unable to load transfer details.");
    return { transfer: transferResult.data, events: eventsResult.data ?? [] };
  });

export const createTransfer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => transferInput.parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase.rpc("create_admin_transfer", {
      p_sender_first_name: data.sender_first_name, p_sender_last_name: data.sender_last_name,
      p_sender_phone: data.sender_phone, p_receiver_first_name: data.receiver_first_name,
      p_receiver_last_name: data.receiver_last_name, p_receiver_country: data.receiver_country,
      p_send_amount: data.send_amount, p_send_currency: data.send_currency,
      // Database function accepts nullable optional values; generated RPC args do not reflect nullable parameters.
      p_receive_amount: data.receive_amount as number, p_receive_currency: data.receive_currency as string,
      p_status: data.status, p_status_detail: data.status_detail, p_delivery_method: data.delivery_method,
    });
    if (error || !row) throw new Error("Unable to create transfer. Please try again.");
    return row;
  });

export const updateTransfer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ id: z.string().uuid(), updates: transferInput.partial() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const updates = Object.fromEntries(
      Object.entries(data.updates).filter(([, value]) => value !== undefined),
    ) as import("@/integrations/supabase/types").TablesUpdate<"transfers">;
    const { data: row, error } = await context.supabase
      .from("transfers")
      .update(updates)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error("Unable to update transfer status.");
    return row;
  });

export const deleteTransfer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("transfers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
