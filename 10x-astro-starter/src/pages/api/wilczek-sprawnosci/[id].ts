import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const { id } = params;
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  const { error } = await supabase.from("wilczek_sprawnosci").delete().eq("id", id);

  if (error) return new Response(JSON.stringify({ error: "Błąd usuwania z bazy danych" }), { status: 500 });

  return new Response(null, { status: 204 });
};
