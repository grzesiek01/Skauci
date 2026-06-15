import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { wilczekSprawnosccBodySchema } from "@/lib/wilczekSprawnosccSchema";

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

  const parsed = wilczekSprawnosccBodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { error } = await supabase.from("wilczek_sprawnosci").insert({
    wilczek_id: parsed.data.wilczek_id,
    sprawnosc_id: parsed.data.sprawnosc_id,
    data_uzyskania: parsed.data.data_uzyskania ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return new Response(JSON.stringify({ error: "Ta sprawność jest już przypisana do tego wilczka" }), {
        status: 409,
      });
    }
    return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });
  }

  return new Response(null, { status: 201 });
};
