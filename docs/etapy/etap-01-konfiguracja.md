# Etap 1 — Konfiguracja i uruchomienie lokalne

## Co zostało zrobione

- Potwierdzono użycie **Supabase Cloud** (opcja B — bez Dockera)
- Plik `.dev.vars` zawierał już gotowe klucze `SUPABASE_URL` i `SUPABASE_KEY`
- Serwer deweloperski uruchomiony komendą `npm run dev` (`http://localhost:4321/`)
- Logowanie działa — konto szefa grupy (`grzegorz.swed@gmail.com`) aktywne

## Decyzje

- **Supabase Cloud zamiast lokalnego** — brak Dockera, darmowy plan wystarczający dla jednej grupy
- Projekt Supabase: `ksdbexbyxjpyaiuwclbs.supabase.co`

## Stack potwierdzony

| Warstwa | Technologia |
|---|---|
| Framework | Astro 6 SSR |
| Interaktywność | React 19 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Baza danych + Auth | Supabase Cloud (PostgreSQL) |
| Hosting (docelowy) | Cloudflare Workers |
| Język | TypeScript |

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/.dev.vars` | istniejący | Zawierał już klucze `SUPABASE_URL` i `SUPABASE_KEY` — bez zmian |

## Uruchomienie lokalne

```bash
cd 10x-astro-starter
npm run dev
# → http://localhost:4321/
```
