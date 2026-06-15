import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { rodzicUpdateSchema } from "@/lib/rodzicSchema";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const { id } = params;
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Nieprawidłowy format danych" }), { status: 400 });
  }

  const parsed = rodzicUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { imie, nazwisko, telefon, email, relacja } = parsed.data;

  if (relacja === "matka" || relacja === "ojciec") {
    const { data: current } = await supabase.from("rodzice").select("wilczek_id").eq("id", id).single();

    if (current) {
      const { data: others } = await supabase
        .from("rodzice")
        .select("id, relacja")
        .eq("wilczek_id", current.wilczek_id)
        .neq("id", id);

      if (relacja === "matka" && others?.some((r) => r.relacja === "matka")) {
        return new Response(JSON.stringify({ error: "Wilczek ma już przypisaną matkę." }), { status: 422 });
      }
      if (relacja === "ojciec" && others?.some((r) => r.relacja === "ojciec")) {
        return new Response(JSON.stringify({ error: "Wilczek ma już przypisanego ojca." }), { status: 422 });
      }
    }
  }

  const { error } = await supabase
    .from("rodzice")
    .update({
      imie: imie.trim(),
      nazwisko: nazwisko.trim(),
      telefon: telefon.trim() || null,
      email: email.trim() || null,
      relacja: relacja.trim() || null,
    })
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });
  }

  return new Response(null, { status: 204 });
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const { id } = params;
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  const { error } = await supabase.from("rodzice").delete().eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: "Błąd usuwania z bazy danych" }), { status: 500 });
  }

  return new Response(null, { status: 204 });
};
