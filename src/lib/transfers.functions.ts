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
      .select("mtcn, sender_first_name, receiver_first_name, receiver_last_name, receiver_country, send_amount, send_currency, receive_amount, receive_currency, status, status_detail, created_at, updated_at")
      .eq("mtcn", data.mtcn)
      .maybeSingle();
    if (!row) return { found: false as const };
    if (row.sender_first_name.trim().toLowerCase() !== data.firstName.trim().toLowerCase()) {
      return { found: false as const };
    }
    const { sender_first_name: _omit, ...publicFields } = row;
    return { found: true as const, transfer: publicFields };
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

export const createTransfer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => transferInput.parse(data))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("transfers")
      .insert({ ...data, mtcn: "" })
      .select()
      .single();
    if (error) throw new Error(error.message);
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
    if (error) throw new Error(error.message);
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
