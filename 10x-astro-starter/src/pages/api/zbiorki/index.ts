import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import type { Zbiorka } from "@/types";
import { zbiorkaSchema } from "@/lib/zbiorkaSchema";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  const { data, error } = await supabase.from("zbiorki").select("*").order("data", { ascending: false });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Nieprawidłowy format danych" }), { status: 400 });
  }

  const parsed = zbiorkaSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { data, error } = await supabase
    .from("zbiorki")
    .insert({
      data: parsed.data.data,
      temat: parsed.data.temat.trim() !== "" ? parsed.data.temat.trim() : null,
      miejsce: parsed.data.miejsce.trim() !== "" ? parsed.data.miejsce.trim() : null,
    })
    .select()
    .single<Zbiorka>();

  if (error) return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
