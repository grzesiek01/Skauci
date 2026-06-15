# Etap 9 — Testy jednostkowe

## Cel

Dodanie testów jednostkowych dla walidatorów i schematów Zod za pomocą Vitest.

## Narzędzia

- **Vitest 4** — runner testów kompatybilny z Vite/Astro, bez potrzeby osobnej konfiguracji bundlera
- Konfiguracja alias `@/*` → `src/*` w `vitest.config.ts`, by testy mogły importować z `@/lib/...`

## Zakres testów (61 testów w 4 plikach)

### `validators.test.ts` (35 testów)
- `isValidPesel` — prawidłowy, błędna suma kontrolna, za krótki/długi, litery
- `isValidKodPocztowy` — format `XX-XXX`, brak myślnika, złe położenie, litery
- `isValidDataUrodzenia` — prawidłowa data, 31 lutego, 29 lutego poza rokiem przestępnym, zerowe wartości, błędny format
- `isValidTelefon` — pusty (opcjonalny), 9 cyfr, `+48` prefiks, ze spacjami/myślnikami, za krótki, litery
- `dataUrodzeniaToIso` / `isoToDataUrodzenia` — konwersja i wzajemna odwracalność
- `isFutureIsoDate` — data przyszła / przeszła

### `wilczekSchema.test.ts` (9 testów)
- Minimalne dane (imię + nazwisko)
- Pełne dane z PESEL i kodem pocztowym
- Pola nullable jako null
- Brak imienia / nazwiska
- Nieprawidłowy PESEL / kod pocztowy
- Szóstka spoza słownika
- Parametryczne testy wszystkich 4 szóstek: Biała, Szara, Czarna, Brunatna

### `rodzicSchema.test.ts` (9 testów)
- `rodzicBodySchema` — minimalne dane, wartości domyślne, pełne dane, brak imienia/nazwiska, nieprawidłowy UUID, brak wilczek_id
- `rodzicUpdateSchema` — brak wilczek_id (poprawny), brak imienia (błędny)

### `zbiorkaSchema.test.ts` (8 testów)
- `zbiorkaSchema` — sama data, pełne dane, wartości domyślne, pusta data, brak pola data
- `obecnosciSchema` — pusta lista, poprawne wpisy, nieprawidłowy UUID, brak pola `obecny`, brak pola `obecnosci`

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `package.json` | edytowany | Dodano skrypty `test` (vitest run) i `test:watch` (vitest); dodano `vitest` do devDependencies |
| `vitest.config.ts` | dodany | Konfiguracja Vitest: środowisko node, alias `@` → `./src` |
| `src/lib/__tests__/validators.test.ts` | dodany | Testy walidatorów (PESEL, kod pocztowy, data urodzenia, telefon, konwersje dat) |
| `src/lib/__tests__/wilczekSchema.test.ts` | dodany | Testy schematu Zod wilczka |
| `src/lib/__tests__/rodzicSchema.test.ts` | dodany | Testy schematów Zod rodzica (body i update) |
| `src/lib/__tests__/zbiorkaSchema.test.ts` | dodany | Testy schematów Zod zbiórki i obecności |
