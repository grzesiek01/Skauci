# Sprawozdanie z konfiguracji projektu 10x Astro Starter

**Data:** 2026-05-20  
**Projekt:** [grzesiek01/10x-astro-starter](https://github.com/grzesiek01/10x-astro-starter)

---

## Co zostało zrobione

### 1. Instalacja Node.js

Node.js nie był zainstalowany w systemie. Zainstalowano wersję **v24.15.0 LTS** przez `winget`:

```
winget install OpenJS.NodeJS.LTS
```

> README wymaga v22.14.0, jednak ta wersja nie jest dostępna w rejestrze winget. Zainstalowano najnowszy LTS (v24), który jest w pełni kompatybilny.

---

### 2. Instalacja zależności npm

Zainstalowano 773 pakiety z `package.json`:

```
npm install
```

Główne zależności projektu:
- Astro v6 (SSR, runtime Cloudflare Workers)
- React v19 (wyspy interaktywne)
- Tailwind CSS v4
- Supabase JS + SSR (`@supabase/supabase-js`, `@supabase/ssr`)
- shadcn/ui (komponenty UI)
- Husky + lint-staged (git hooks)
- Wrangler (deployment Cloudflare)

---

### 3. Pliki środowiskowe

Skopiowano `.env.example` do dwóch plików (oba są w `.gitignore`):

| Plik | Cel |
|------|-----|
| `.env` | Zmienne dla Node.js / `astro dev` |
| `.dev.vars` | Sekrety dla Cloudflare local dev (Wrangler) |

Uzupełniono obie pliki danymi projektu Supabase:

```
SUPABASE_URL=https://ksdbexbyxjpyaiuwclbs.supabase.co
SUPABASE_KEY=<anon key>
```

---

### 4. Konfiguracja Supabase (chmura)

Wybrano wariant **Supabase Cloud** (bez lokalnego Dockera). Projekt Supabase jest hostowany na `supabase.com`. Uwierzytelnianie opiera się na wbudowanej tabeli `auth.users` — nie są potrzebne żadne własne migracje.

Dostępne trasy auth:
- `/auth/signin` — logowanie email/hasło
- `/auth/signup` — rejestracja
- `/auth/confirm-email` — strona po rejestracji
- `/dashboard` — przykładowa chroniona strona

---

### 5. Konfiguracja Husky (git hooks)

Naprawiono ścieżkę git hooks z przestarzałego `.husky/_` (Husky v8) na `.husky` (Husky v9):

```
git config core.hooksPath .husky
```

Pre-commit hook (`./husky/pre-commit`) uruchamia `lint-staged`, który automatycznie:
- naprawia błędy ESLint w plikach `*.{ts,tsx,astro}`
- formatuje Prettierem pliki `*.{json,css,md}`

---

## Jak uruchomić projekt

```bash
cd 10x-astro-starter
npm run dev
```

Aplikacja startuje pod adresem `http://localhost:4321`.

---

## Uwagi

- Docker nie jest zainstalowany — lokalny stos Supabase (`npx supabase start`) nie jest dostępny.
- W Supabase dashboard warto wyłączyć **Email Confirmation** dla łatwiejszego developmentu lokalnego: *Authentication → Email → Confirm email → OFF*.
- Deployment na Cloudflare Workers: `npx wrangler deploy` (wymaga konta Cloudflare i autoryzacji Wrangler).
