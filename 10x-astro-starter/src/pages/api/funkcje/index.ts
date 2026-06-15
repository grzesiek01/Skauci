import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { funkcjaBodySchema } from "@/lib/funkcjaSchema";

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

  const parsed = funkcjaBodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { error } = await supabase.from("funkcje").insert({
    wilczek_id: parsed.data.wilczek_id,
    nazwa: parsed.data.nazwa,
    data_od: parsed.data.data_od,
    data_do: parsed.data.data_do ?? null,
  });

  if (error) return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });

  return new Response(null, { status: 201 });
};
