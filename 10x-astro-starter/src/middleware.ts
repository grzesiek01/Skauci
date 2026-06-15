import { defineMiddleware } from "astro:middleware";
import { createClient } from "@/lib/supabase";

const PUBLIC_ROUTES = ["/auth/signin", "/auth/confirm-email", "/api/auth/signin", "/api/auth/signout"];

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createClient(context.request.headers, context.cookies);

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    context.locals.user = user ?? null;
  } else {
    context.locals.user = null;
  }

  const { pathname } = context.url;
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!isPublic && !context.locals.user) {
    return context.redirect("/auth/signin");
  }

  if (isPublic && context.locals.user && pathname.startsWith("/auth/")) {
    return context.redirect("/wilczki");
  }

  return next();
});
