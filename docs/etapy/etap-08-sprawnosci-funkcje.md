# Etap 8 — Moduł sprawności, funkcji i szóstek

## Co zostało zrobione

### Szóstki

- Migracja `20260609000001_add_szostka.sql` — dodano kolumnę `szostka text CHECK (...)` do tabeli `wilczki`; dozwolone wartości: Biała, Szara, Czarna, Brunatna
- Typ `Wilczek` i `WilczekFormData` zaktualizowane o pole `szostka`
- `wilczekSchema` — dodano `SZOSTKI` jako `const` array i walidację pola
- Formularz edycji/dodawania wilczka — nowy select z 4 opcjami szóstki (przed sekcją adresu)
- Lista wilczków `/wilczki` — przepisana; nowe kolumny **Szóstka** i **Funkcja** zastąpiły PESEL i Miejscowość; aktualna funkcja pobierana przez join na `funkcje WHERE data_do IS NULL`

### Sprawności — słownik

- Migracja `20260609000000_seed_sprawnosci.sql` — 29 domyślnych sprawności w 5 kategoriach (Służba, Zręczność, Wiara, Wiedza, Zmysł praktyczny)
- Strona `/sprawnosci` — lista słownika pogrupowana według kategorii z akcjami Edytuj / Usuń
- Formularz dodawania `/sprawnosci/nowa` — pola: nazwa, kategoria (z podpowiedziami istniejących kategorii via datalist), opis
- Formularz edycji `/sprawnosci/[id]/edytuj`
- API `GET /api/sprawnosci` — lista posortowana po kategorii i nazwie
- API `POST /api/sprawnosci` — tworzenie z walidacją unikalności nazwy (HTTP 409)
- API `PUT /api/sprawnosci/[id]` — aktualizacja
- API `DELETE /api/sprawnosci/[id]` — usunięcie (cascade usuwa przypisania wilczków)
- Link **Sprawności** dodany do navbara

### Sprawności — przypisywanie do wilczka

- Zakładka **Sprawności** w profilu wilczka — lista przypisanych sprawności pogrupowana po kategorii z datą uzyskania i przyciskiem Usuń
- Formularz `/wilczki/[id]/sprawnosc/nowa` — dropdown podzielony na optgroup według kategorii; pokazuje tylko niePrzypisane sprawności; opcjonalna data uzyskania
- API `POST /api/wilczek-sprawnosci` — przypisanie z walidacją duplikatu (HTTP 409)
- API `DELETE /api/wilczek-sprawnosci/[id]` — usunięcie przypisania

### Funkcje w grupie

- Nowa zakładka **Funkcje** w profilu wilczka — tabela historii funkcji z datami i statusem (aktualna / zakończona)
- Formularz `/wilczki/[id]/funkcja/nowa` — select z predefiniowanymi nazwami (Szóstkowy, Czołowy), data_od (wymagana), data_do (opcjonalna)
- Formularz `/wilczki/[id]/funkcja/[funkcja_id]/edytuj`
- API `POST /api/funkcje` — tworzenie
- API `PUT /api/funkcje/[id]` — aktualizacja
- API `DELETE /api/funkcje/[id]` — usunięcie

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/supabase/migrations/20260609000000_seed_sprawnosci.sql` | dodany | 29 domyślnych sprawności w 5 kategoriach |
| `10x-astro-starter/supabase/migrations/20260609000001_add_szostka.sql` | dodany | Kolumna szostka z CHECK constraint w tabeli wilczki |
| `10x-astro-starter/src/types.ts` | edytowany | Dodano Sprawnosc, SprawnosccFormData, WilczekSprawnosc, WilczekSprawnosccFormData, Funkcja, FunkcjaFormData; zaktualizowano Wilczek i WilczekFormData o szostka |
| `10x-astro-starter/src/lib/wilczekSchema.ts` | edytowany | Dodano SZOSTKI constant i walidację pola szostka |
| `10x-astro-starter/src/lib/sprawnosccSchema.ts` | dodany | Zod: sprawnosccBodySchema, sprawnosccUpdateSchema |
| `10x-astro-starter/src/lib/wilczekSprawnosccSchema.ts` | dodany | Zod: wilczekSprawnosccBodySchema |
| `10x-astro-starter/src/lib/funkcjaSchema.ts` | dodany | Zod: funkcjaBodySchema, funkcjaUpdateSchema; eksportuje FUNKCJE_NAMES |
| `10x-astro-starter/src/pages/api/sprawnosci/index.ts` | dodany | GET + POST |
| `10x-astro-starter/src/pages/api/sprawnosci/[id].ts` | dodany | PUT + DELETE |
| `10x-astro-starter/src/pages/api/wilczek-sprawnosci/index.ts` | dodany | POST przypisania |
| `10x-astro-starter/src/pages/api/wilczek-sprawnosci/[id].ts` | dodany | DELETE przypisania |
| `10x-astro-starter/src/pages/api/funkcje/index.ts` | dodany | POST |
| `10x-astro-starter/src/pages/api/funkcje/[id].ts` | dodany | PUT + DELETE |
| `10x-astro-starter/src/components/sprawnosci/SprawnosccForm.tsx` | dodany | React: formularz add/edit słownika sprawności z datalist kategorii |
| `10x-astro-starter/src/components/wilczki/WilczekSprawnosccForm.tsx` | dodany | React: dropdown do przypisania sprawności, zgrupowany po kategorii |
| `10x-astro-starter/src/components/wilczki/FunkcjaForm.tsx` | dodany | React: formularz add/edit funkcji z predefiniowaną listą nazw |
| `10x-astro-starter/src/pages/sprawnosci/index.astro` | dodany | Słownik sprawności pogrupowany po kategorii |
| `10x-astro-starter/src/pages/sprawnosci/nowa.astro` | dodany | Strona dodawania sprawności |
| `10x-astro-starter/src/pages/sprawnosci/[id]/edytuj.astro` | dodany | Strona edycji sprawności |
| `10x-astro-starter/src/pages/wilczki/[id]/sprawnosc/nowa.astro` | dodany | Strona przypisania sprawności do wilczka |
| `10x-astro-starter/src/pages/wilczki/[id]/funkcja/nowa.astro` | dodany | Strona dodawania funkcji |
| `10x-astro-starter/src/pages/wilczki/[id]/funkcja/[funkcja_id]/edytuj.astro` | dodany | Strona edycji funkcji |
| `10x-astro-starter/src/components/wilczki/WilczekForm.tsx` | edytowany | Dodano select szóstki (Biała/Szara/Czarna/Brunatna) |
| `10x-astro-starter/src/pages/wilczki/index.astro` | edytowany | Nowe kolumny Szóstka i Funkcja; fetch aktualnych funkcji przez join |
| `10x-astro-starter/src/pages/wilczki/[id]/index.astro` | edytowany | Zakładka sprawności z tabelą wg kategorii; nowa zakładka Funkcje z historią i statusem |
| `10x-astro-starter/src/layouts/AppLayout.astro` | edytowany | Dodano link Sprawności w nawigacji |
