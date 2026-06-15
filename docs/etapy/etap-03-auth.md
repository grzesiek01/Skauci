# Etap 3 — Uproszczenie auth (jeden użytkownik)

## Co zostało zrobione

- Middleware rozszerzony — wszystkie trasy poza listą publicznych wymagają zalogowania
- Zalogowany użytkownik odwiedzający `/auth/signin` jest automatycznie przekierowywany na `/dashboard`
- Endpoint `/api/auth/signup` zwraca 403 (rejestracja wyłączona)
- Strona `/auth/signup` przekierowuje na `/auth/signin`
- Usunięto link „Don't have an account? Sign up" ze strony logowania
- Po poprawnym logowaniu przekierowanie trafia na `/dashboard` zamiast `/`

## Trasy publiczne (bez logowania)

| Trasa | Opis |
|---|---|
| `/auth/signin` | Strona logowania |
| `/auth/confirm-email` | Potwierdzenie e-mail (nieużywane, ale zachowane) |
| `/api/auth/signin` | POST — logowanie |
| `/api/auth/signout` | POST — wylogowanie |

Wszystkie pozostałe trasy wymagają sesji; brak sesji → redirect na `/auth/signin`.

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/src/middleware.ts` | edytowany | Zastąpiono whitelist chronionych tras whitelistą tras publicznych; dodano przekierowanie zalogowanych z `/auth/*` na `/dashboard` |
| `10x-astro-starter/src/pages/api/auth/signup.ts` | edytowany | Endpoint zwraca 403 — rejestracja wyłączona |
| `10x-astro-starter/src/pages/auth/signup.astro` | edytowany | Strona przekierowuje na `/auth/signin` |
| `10x-astro-starter/src/pages/auth/signin.astro` | edytowany | Usunięto link do strony rejestracji |
| `10x-astro-starter/src/pages/api/auth/signin.ts` | edytowany | Po logowaniu przekierowanie na `/dashboard` |
