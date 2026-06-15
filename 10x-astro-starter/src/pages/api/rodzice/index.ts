import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { rodzicBodySchema } from "@/lib/rodzicSchema";

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

  const parsed = rodzicBodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { wilczek_id, imie, nazwisko, telefon, email, relacja } = parsed.data;

  const { data: existing } = await supabase.from("rodzice").select("id, relacja").eq("wilczek_id", wilczek_id);

  if (existing && existing.length >= 2) {
    return new Response(JSON.stringify({ error: "Wilczek może mieć maksymalnie dwoje rodziców / opiekunów." }), {
      status: 422,
    });
  }
  if (relacja === "matka" && existing?.some((r) => r.relacja === "matka")) {
    return new Response(JSON.stringify({ error: "Wilczek ma już przypisaną matkę." }), { status: 422 });
  }
  if (relacja === "ojciec" && existing?.some((r) => r.relacja === "ojciec")) {
    return new Response(JSON.stringify({ error: "Wilczek ma już przypisanego ojca." }), { status: 422 });
  }

  const { error } = await supabase.from("rodzice").insert({
    wilczek_id,
    imie: imie.trim(),
    nazwisko: nazwisko.trim(),
    telefon: telefon.trim() || null,
    email: email.trim() || null,
    relacja: relacja.trim() || null,
  });

  if (error) {
    return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });
  }

  return new Response(null, { status: 201 });
};
