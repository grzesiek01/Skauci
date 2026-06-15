import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { sprawnosccUpdateSchema } from "@/lib/sprawnosccSchema";

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

  const parsed = sprawnosccUpdateSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { error } = await supabase.from("sprawnosci").update(parsed.data).eq("id", id);

  if (error) return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });

  return new Response(null, { status: 204 });
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const { id } = params;
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  const { error } = await supabase.from("sprawnosci").delete().eq("id", id);

  if (error) return new Response(JSON.stringify({ error: "Błąd usuwania z bazy danych" }), { status: 500 });

  return new Response(null, { status: 204 });
};
