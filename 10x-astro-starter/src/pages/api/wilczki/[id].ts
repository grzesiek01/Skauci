import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import type { Wilczek } from "@/types";
import { wilczekSchema } from "@/lib/wilczekSchema";

export const prerender = false;

export const PUT: APIRoute = async (context) => {
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500 });
  }

  const { id } = context.params;

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const result = wilczekSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Błąd walidacji";
    return new Response(JSON.stringify({ error: message }), { status: 422 });
  }

  const payload = {
    ...result.data,
    data_urodzenia: result.data.data_urodzenia !== "" ? result.data.data_urodzenia : null,
    pesel: result.data.pesel !== "" ? result.data.pesel : null,
    ulica: result.data.ulica !== "" ? result.data.ulica : null,
    miasto: result.data.miasto !== "" ? result.data.miasto : null,
    kod_pocztowy: result.data.kod_pocztowy !== "" ? result.data.kod_pocztowy : null,
  };

  const { data, error } = await supabase.from("wilczki").update(payload).eq("id", id).select().single<Wilczek>();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async (context) => {
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500 });
  }

  const { id } = context.params;

  const { error } = await supabase.from("wilczki").delete().eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(null, { status: 204 });
};
