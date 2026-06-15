# Plan tworzenia aplikacji — Zarządzanie gromadą harcerzy

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | Astro 6 (SSR) |
| Interaktywność | React 19 (wyspy) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Baza danych + Auth | Supabase (PostgreSQL) |
| Hosting | Cloudflare Workers |
| Język | TypeScript |

---

## Etap 1 — Konfiguracja i uruchomienie lokalne

- Instalacja Dockera (wymagany przez Supabase lokalnie)
- Uruchomienie `npx supabase start` + `npm run dev`
- Weryfikacja że logowanie działa out-of-the-box

## Etap 2 — Schemat bazy danych

- Migracje SQL: tabele `harcerze`, `rodzice`, `sprawnosci`, `funkcje`, `obecnosci`, `skladki`
- Relacje między tabelami, RLS (Row Level Security) w Supabase

## Etap 3 — Uproszczenie auth (jeden użytkownik)

- Wyłączenie rejestracji — tylko logowanie
- Ręczne założenie jednego konta (szef grupy)
- Rozszerzenie chronionych tras na całą aplikację

## Etap 4 — Lista harcerzy i CRUD

- Strona główna po zalogowaniu: tabela z listą harcerzy
- Formularz dodawania i edycji harcerza
- API route + integracja z Supabase

## Etap 5 — Profil harcerza

- Widok szczegółowy: dane osobowe, dane rodziców, PESEL, adres
- Zakładki: dane / sprawności / obecności / składki

## Etap 6 — Moduł obecności

- Widok zbiórek (tworzenie zbiórki, data)
- Oznaczanie obecności dla całej grupy jednocześnie
- Historia i procent frekwencji per harcerz

## Etap 7 — Moduł składek

- Rejestrowanie wpłat per harcerz per miesiąc
- Widok zaległości (kto nie zapłacił)

## Etap 8 — Moduł sprawności, funkcji i szóstek

- Słownik sprawności z kategoriami (29 wbudowanych: Służba, Zręczność, Wiara, Wiedza, Zmysł praktyczny) + pełny CRUD
- Przypisywanie sprawności do wilczka z datą uzyskania; zakładka Sprawności w profilu
- Funkcje w grupie (Szóstkowy, Czołowy) per wilczek z datami (data_od, data_do); zakładka Funkcje w profilu
- Szóstki (Biała, Szara, Czarna, Brunatna) jako pole wilczka; widoczne na liście wilczków obok aktualnej funkcji

## Etap 9 — Testy jednostkowe

### Narzędzia

- **Vitest** — runner testów, integruje się z Vite/Astro bez dodatkowej konfiguracji
- **@testing-library/react** — testy komponentów React (wyspy interaktywne)
- **jsdom** — środowisko DOM dla testów komponentów

### Zakres testów

#### Walidatory (`src/lib/validators.ts`)
- `isValidPesel` — poprawny PESEL, błędna suma kontrolna, zła długość, litery
- `isValidKodPocztowy` — poprawne i błędne formaty kodu pocztowego
- `isValidDataUrodzenia` — poprawna data, 31 lutego, przyszła data, zły format
- `isValidTelefon` — 9 cyfr, z prefiksem `+48`, za krótki, litery
- `dataUrodzeniaToIso` / `isoToDataUrodzenia` — konwersja w obie strony

#### Schematy Zod (`src/lib/*Schema.ts`)
- `wilczekSchema` — walidacja prawidłowych i nieprawidłowych danych wilczka
- `rodzicSchema` — walidacja relacji (matka/ojciec/opiekun), wymagane pola
- `zbiorkaSchema` — walidacja danych zbiórki

#### Logika biznesowa rodzica
- Limit 2 rodziców per wilczek (max 1 matka, max 1 ojciec) — funkcja sprawdzająca

#### Komponenty React (opcjonalnie)
- `WilczekForm` — renderowanie, walidacja po stronie klienta
- `ObecnosciForm` — „Zaznacz wszystkich" / „Odznacz wszystkich"

### Struktura plików

```
10x-astro-starter/
  src/
    lib/
      __tests__/
        validators.test.ts
        wilczekSchema.test.ts
        rodzicSchema.test.ts
        zbiorkaSchema.test.ts
  vitest.config.ts
```

## Etap 10 — Wdrożenie na Cloudflare Workers

- Konfiguracja projektu Supabase w chmurze
- `npx wrangler deploy`
