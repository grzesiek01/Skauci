import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import { sprawnosccBodySchema } from "@/lib/sprawnosccSchema";
import type { Sprawnosc } from "@/types";

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(request.headers, cookies);
  if (!supabase) return new Response(JSON.stringify({ error: "Brak autoryzacji" }), { status: 401 });

  const { data, error } = (await supabase.from("sprawnosci").select("*").order("kategoria").order("nazwa")) as {
    data: Sprawnosc[] | null;
    error: unknown;
  };

  if (error) return new Response(JSON.stringify({ error: "Błąd serwera" }), { status: 500 });

  return new Response(JSON.stringify(data ?? []), { status: 200 });
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

  const parsed = sprawnosccBodySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const { data, error } = (await supabase.from("sprawnosci").insert(parsed.data).select().single()) as {
    data: Sprawnosc | null;
    error: { code?: string } | null;
  };

  if (error) {
    if (error.code === "23505") {
      return new Response(JSON.stringify({ error: "Sprawność o tej nazwie już istnieje" }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: "Błąd zapisu do bazy danych" }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 201 });
};
