import { createServerFn } from "@tanstack/react-start";

type RatesPayload = { rates: Record<string, number>; updatedAt: string };

let cache: { data: RatesPayload; expires: number } | null = null;

export const getExchangeRates = createServerFn({ method: "GET" }).handler(async (): Promise<RatesPayload> => {
  if (cache && cache.expires > Date.now()) return cache.data;
  const res = await fetch("https://open.er-api.com/v6/latest/USD", { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error("Rates unavailable");
  const json = (await res.json()) as { result?: string; rates?: Record<string, number>; time_last_update_utc?: string };
  if (json.result !== "success" || !json.rates) throw new Error("Rates unavailable");
  const data: RatesPayload = { rates: json.rates, updatedAt: json.time_last_update_utc ?? new Date().toISOString() };
  cache = { data, expires: Date.now() + 60 * 60 * 1000 };
  return data;
});
