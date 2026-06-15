import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { skladkaBodySchema } from "@/lib/skladkaSchema";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Nieprawidłowy format danych" }), { status: 400 });
  }

  const parsed = skladkaBodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { wilczek_id, rok, kwota, zaplacono, data_wplaty } = parsed.data;

  const { data: existing } = await supabase
    .from("skladki")
    .select("id")
    .eq("wilczek_id", wilczek_id)
    .eq("rok", rok)
    .single();

  if (existing) {
    return new Response(JSON.stringify({ error: `Składka za rok ${rok} już istnieje dla tego wilczka.` }), {
      status: 422,
    });
  }

  const { error } = await supabase.from("skladki").insert({
    wilczek_id,
    rok,
    kwota: kwota ?? null,
    zaplacono,
    data_wplaty: data_wplaty ?? null,
  });

  if (error) return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });

  return new Response(null, { status: 201 });
};
