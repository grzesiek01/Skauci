# Etap 4 — Lista wilczków i CRUD

## Co zostało zrobione

- Dodano typy TypeScript dla modelu `Wilczek`
- Stworzono czysty layout aplikacji (`AppLayout.astro`) — zastępuje cosmic theme na stronach chronionych
- Strona `/wilczki` — tabela z listą wilczków (imię, nazwisko, data urodzenia, PESEL, miejscowość) z przyciskami Edytuj / Usuń
- Strona `/wilczki/nowy` — formularz dodawania
- Strona `/wilczki/[id]/edytuj` — formularz edycji z wczytanymi danymi
- Formularz React (`WilczekForm`) obsługuje tryb dodawania i edycji; wysyła JSON do API
- Walidacja pola PESEL — algorytm sumy kontrolnej (11 cyfr + weryfikacja cyfry kontrolnej)
- Walidacja kodu pocztowego — format `XX-XXX`
- Pole daty urodzenia jako tekst (format `DD.MM.RRRR`) z walidacją formatu i realności daty (np. 31.02 jest odrzucane); konwersja DD.MM.RRRR ↔ ISO przy wysyłaniu do API i ładowaniu danych edycji
- Schemat zod wyciągnięty do `src/lib/wilczekSchema.ts` — współdzielony przez oba API routes
- API `GET /api/wilczki` — lista wilczków posortowana po nazwisku
- API `POST /api/wilczki` — tworzenie wilczka z walidacją zod
- API `PUT /api/wilczki/[id]` — aktualizacja wilczka
- API `DELETE /api/wilczki/[id]` — usunięcie wilczka (z potwierdzeniem po stronie klienta)
- Po zalogowaniu redirect trafia na `/wilczki` (zamiast `/dashboard`)
- `/dashboard` przekierowuje na `/wilczki`

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/src/types.ts` | dodany | Interfejsy `Wilczek` i `WilczekFormData` |
| `10x-astro-starter/src/layouts/AppLayout.astro` | dodany | Layout dla chronionych stron aplikacji — navbar z logo, linkiem do wilczków i przyciskiem wylogowania |
| `10x-astro-starter/src/pages/wilczki/index.astro` | dodany | Lista wilczków — tabela + przyciski Edytuj/Usuń; usuwanie przez fetch DELETE |
| `10x-astro-starter/src/pages/wilczki/nowy.astro` | dodany | Strona formularza dodawania wilczka |
| `10x-astro-starter/src/pages/wilczki/[id]/edytuj.astro` | dodany | Strona formularza edycji — pobiera wilczka z Supabase po ID |
| `10x-astro-starter/src/components/wilczki/WilczekForm.tsx` | dodany | React: formularz add/edit z walidacją front-end, fetch do API, redirect po sukcesie |
| `10x-astro-starter/src/pages/api/wilczki/index.ts` | dodany | GET (lista) + POST (tworzenie) z walidacją zod |
| `10x-astro-starter/src/pages/api/wilczki/[id].ts` | dodany | PUT (aktualizacja) + DELETE (usunięcie) z walidacją zod |
| `10x-astro-starter/src/lib/validators.ts` | dodany | Funkcje walidujące: `isValidPesel`, `isValidKodPocztowy`, `isValidDataUrodzenia`, `dataUrodzeniaToIso`, `isoToDataUrodzenia` |
| `10x-astro-starter/src/lib/wilczekSchema.ts` | dodany | Schemat zod dla wilczka z walidacją PESEL i kodu pocztowego przez `.refine()`; współdzielony przez oba API routes |
| `10x-astro-starter/src/pages/api/auth/signin.ts` | edytowany | Redirect po logowaniu zmieniony na `/wilczki` |
| `10x-astro-starter/src/middleware.ts` | edytowany | Redirect zalogowanych z auth pages zmieniony na `/wilczki` |
| `10x-astro-starter/src/pages/dashboard.astro` | edytowany | Przekierowuje na `/wilczki` |
