# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Web application for managing a Polish Cub Scout group (gromada wilczków). Single-user app — only the group leader (drużynowy) has access. Built on top of the `10x-astro-starter` template.

All application code lives in `10x-astro-starter/`. The `docs/` folder contains the development plan and per-stage documentation in Polish.

## Commands

All commands must be run from `10x-astro-starter/`:

```bash
npm run dev        # dev server at http://localhost:4321 (uses .dev.vars for secrets)
npm run build      # production build (Cloudflare Workers SSR)
npm run lint       # ESLint with type checking
npm run lint:fix   # auto-fix lint issues
npm run format     # Prettier
```

Supabase (database):
```bash
npx supabase link --project-ref ksdbexbyxjpyaiuwclbs
npx supabase db push        # apply new migrations to cloud
```

Env secrets for local dev go in `10x-astro-starter/.dev.vars` (not `.env` — this is a Cloudflare Workers project).

## Architecture

**Astro 6 SSR** app deployed to Cloudflare Workers. Every page is server-rendered. React is used only for interactive islands (forms, dynamic UI).

```
src/
  pages/          # file-based routing; .astro = pages, api/ = API endpoints
  components/     # .astro for static, .tsx for interactive React islands
    ui/           # shadcn/ui components (new-york style)
    auth/         # auth form components (React)
  layouts/        # Layout.astro — base HTML shell with banner support
  lib/            # supabase.ts (client factory), utils.ts (cn helper), config-status.ts
  middleware.ts   # runs on every request; resolves user, guards protected routes
  types.ts        # shared TypeScript types and DTOs
```

### Request flow

1. `middleware.ts` creates a Supabase SSR client per request, resolves `context.locals.user`
2. Protected routes redirect to `/auth/signin` if no user
3. API routes (`src/pages/api/`) use uppercase exports (`GET`, `POST`); validate with zod
4. Supabase client is created with `createClient(request.headers, cookies)` from `@/lib/supabase`

### Auth

Single-user app — signup is disabled; only the pre-created leader account can log in. Auth uses Supabase email+password with cookie sessions via `@supabase/ssr`.

### Styling

Tailwind 4 with `cn()` helper (`clsx` + `tailwind-merge`) for class merging. Never concatenate class strings manually. New shadcn components: `npx shadcn@latest add [name]`.

## Database schema (Supabase / PostgreSQL)

All tables have RLS enabled — authenticated users have full access.

| Table | Description |
|---|---|
| `wilczki` | Scout members — personal data (imię, nazwisko, PESEL, adres, data_urodzenia) |
| `rodzice` | Parents/guardians linked to a wilczek (relacja: matka/ojciec/opiekun) |
| `sprawnosci` | Skills dictionary (nazwa, opis, kategoria) |
| `wilczek_sprawnosci` | Scout ↔ skill assignment with `data_uzyskania`; unique per pair |
| `funkcje` | Roles held in the group (nazwa, data_od, data_do — null means current) |
| `zbiorki` | Meetings (data, temat, miejsce) |
| `obecnosci` | Attendance per meeting per scout (obecny boolean); unique per pair |
| `skladki` | Annual dues per scout (rok, zaplacono, data_wplaty, kwota); unique per wilczek+rok |

Foreign keys use `on delete cascade` — deleting a wilczek removes all related records.

## Implemented features (stages 1–5)

### Routing

| Route | Opis |
|---|---|
| `/wilczki` | Lista wilczków — tabela z linkami Profil / Edytuj / Usuń |
| `/wilczki/nowy` | Formularz dodawania wilczka |
| `/wilczki/[id]` | Profil wilczka — zakładki `?tab=dane\|sprawnosci\|obecnosci\|skladki` |
| `/wilczki/[id]/edytuj` | Formularz edycji wilczka |
| `/wilczki/[id]/rodzic/nowy` | Formularz dodawania rodzica / opiekuna |
| `/wilczki/[id]/rodzic/[rodzic_id]/edytuj` | Formularz edycji rodzica |
| `/api/wilczki` | GET (lista) + POST (tworzenie) |
| `/api/wilczki/[id]` | PUT (aktualizacja) + DELETE (usunięcie) |
| `/api/rodzice` | POST (tworzenie rodzica) |
| `/api/rodzice/[id]` | PUT (aktualizacja) + DELETE (usunięcie rodzica) |
| `/zbiorki` | Lista zbiórek — tabela z akcjami Obecności / Edytuj / Usuń |
| `/zbiorki/nowa` | Formularz dodawania zbiórki; po dodaniu redirect → strona obecności |
| `/zbiorki/[id]/edytuj` | Formularz edycji zbiórki |
| `/zbiorki/[id]/obecnosci` | Oznaczanie obecności dla całej grupy (checkboxy, bulk upsert) |
| `/api/zbiorki` | GET (lista) + POST (tworzenie, zwraca obiekt) |
| `/api/zbiorki/[id]` | PUT (aktualizacja) + DELETE (kaskada usuwa obecności) |
| `/api/zbiorki/[id]/obecnosci` | POST — bulk upsert obecności dla zbiórki |

### Komponenty

- `src/layouts/AppLayout.astro` — layout dla wszystkich chronionych stron (navbar: Wilczki, Zbiórki, email, Wyloguj)
- `src/components/wilczki/WilczekForm.tsx` — React island: formularz add/edit wilczka; po zapisaniu edycji redirect → profil
- `src/components/wilczki/RodzicForm.tsx` — React island: formularz add/edit rodzica z walidacją limitu i relacji
- `src/components/zbiorki/ZbiorkaForm.tsx` — React island: formularz add/edit zbiórki
- `src/components/zbiorki/ObecnosciForm.tsx` — React island: checkboxy wilczków + bulk upsert; „Zaznacz / Odznacz wszystkich"

### Walidatory (`src/lib/validators.ts`)

- `isValidPesel` — algorytm sumy kontrolnej
- `isValidKodPocztowy` — format `XX-XXX`
- `isValidDataUrodzenia` — format `DD.MM.RRRR` z weryfikacją realności daty
- `isValidTelefon` — 9 cyfr, opcjonalnie poprzedzone `+48`
- `dataUrodzeniaToIso` / `isoToDataUrodzenia` — konwersja DD.MM.RRRR ↔ ISO

### Reguły biznesowe — rodzice

Wilczek może mieć maksymalnie 2 rodziców / opiekunów: max 1 matkę, max 1 ojca. Walidacja po stronie klienta (RodzicForm) i serwera (API routes).

### Konwencje formularzy

- Zod schema dla każdego encji w `src/lib/*Schema.ts` — współdzielona przez API routes
- Formularz React wysyła JSON do API, po sukcesie robi `window.location.href` redirect
- `AppLayout` + karta `rounded-lg border bg-white p-6 shadow-sm` jako standard wyglądu formularzy

## Git workflow

After completing each development stage:

1. Run `cd 10x-astro-starter && git add -A` to stage all changes.
2. Commit with a descriptive message summarizing the stage (Polish or English, consistent with prior commits).
3. Push: `git push origin master`.

The remote is `git@github.com:grzesiek01/10x-astro-starter.git` (SSH). All git commands must be run from `10x-astro-starter/`.

## Stage documentation convention

After completing each development stage, create or update a file in `docs/etapy/etap-XX-nazwa.md`. Each file must include a **Pliki dodane / edytowane** section listing every file touched during that stage:

```markdown
## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `path/to/file.ts` | dodany / edytowany / usunięty | Co zawiera lub co zmieniono |
```

## Domain terminology

| Polish term | Meaning |
|---|---|
| wilczek / wilczki | cub scout(s) — the group members |
| gromada | the scout group/pack |
| drużynowy | group leader (the app's sole user) |
| zbiórka / zbiórki | meeting(s) |
| sprawność / sprawności | skill badge(s) |
| funkcja / funkcje | role(s) held in the group (e.g. zastępowy = patrol leader) |
| składka / składki | membership dues |
| PESEL | Polish national ID number |
