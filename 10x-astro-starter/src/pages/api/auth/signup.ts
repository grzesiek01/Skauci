import type { APIRoute } from "astro";

export const POST: APIRoute = () => {
  return new Response(null, { status: 403 });
};
