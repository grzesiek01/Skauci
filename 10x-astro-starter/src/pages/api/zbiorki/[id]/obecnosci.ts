import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { obecnosciSchema } from "@/lib/zbiorkaSchema";

export const prerender = false;

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const { id: zbiorka_id } = params;
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Nieprawidłowy format danych" }), { status: 400 });
  }

  const parsed = obecnosciSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const rows = parsed.data.obecnosci.map((o) => ({
    zbiorka_id,
    wilczek_id: o.wilczek_id,
    obecny: o.obecny,
  }));

  const { error } = await supabase.from("obecnosci").upsert(rows, { onConflict: "zbiorka_id,wilczek_id" });

  if (error) return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });

  return new Response(null, { status: 204 });
};
