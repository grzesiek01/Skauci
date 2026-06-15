# Etap 5 — Profil wilczka

## Co zostało zrobione

- Strona profilu `/wilczki/[id]` z zakładkami (Dane / Sprawności / Obecności / Składki)
- Aktywna zakładka sterowana parametrem URL `?tab=`; domyślnie `dane`
- Zakładka **Dane**: karta z danymi osobowymi (imię, nazwisko, PESEL, data urodzenia, adres) + sekcja rodziców/opiekunów
- CRUD rodziców/opiekunów: lista, dodawanie, edycja, usuwanie z potwierdzeniem
- Formularz React `RodzicForm` z polami: imię, nazwisko, relacja (matka/ojciec/opiekun), telefon, e-mail
- Walidacja telefonu: `isValidTelefon` — 9 cyfr, opcjonalnie poprzedzone `+48`, ze spacjami/myślnikami; pole opcjonalne
- Walidacja formatu e-mail w formularzu rodzica
- Reguła biznesowa rodziców (front-end + back-end):
  - max 1 matka na wilczka
  - max 1 ojciec na wilczka
  - max 2 rodziców / opiekunów łącznie
  - przycisk „+ Dodaj" ukryty gdy wilczek ma już 2 rodziców
  - strona `/rodzic/nowy` przekierowuje serwer-side gdy limit osiągnięty
  - PUT sprawdza konflikt relacji matka/ojciec przy zmianie edytowanego rekordu
- API `POST /api/rodzice` — tworzenie rodzica z walidacją limitu
- API `PUT /api/rodzice/[id]` — aktualizacja rodzica z walidacją konfliktu relacji
- API `DELETE /api/rodzice/[id]` — usuwanie rodzica
- Zakładki Sprawności / Obecności / Składki: puste stany (do uzupełnienia w etapach 6–8)
- Link „Profil" dodany w liście wilczków
- Strona edycji wilczka (`/wilczki/[id]/edytuj`): breadcrumb nawigacyjny `← Lista / Imię Nazwisko` + przycisk „Profil wilczka →" w prawym górnym rogu
- Po zapisaniu edycji wilczka redirect trafia do profilu zamiast listy; „Anuluj" w trybie edycji też wraca do profilu

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/src/types.ts` | edytowany | Dodano interfejsy `Rodzic` i `RodzicFormData` |
| `10x-astro-starter/src/lib/rodzicSchema.ts` | dodany | Schemat zod dla rodzica: `rodzicBodySchema` (POST) i `rodzicUpdateSchema` (PUT) |
| `10x-astro-starter/src/lib/validators.ts` | edytowany | Dodano `isValidTelefon` |
| `10x-astro-starter/src/pages/wilczki/[id]/index.astro` | dodany | Strona profilu z zakładkami i sekcją rodziców; przycisk „+ Dodaj" ukryty gdy 2 rodziców |
| `10x-astro-starter/src/components/wilczki/RodzicForm.tsx` | dodany | React: formularz add/edit rodzica z walidacją (telefon, e-mail, limit relacji) |
| `10x-astro-starter/src/components/wilczki/WilczekForm.tsx` | edytowany | Redirect po zapisaniu edycji i link „Anuluj" w trybie edycji wskazują na profil |
| `10x-astro-starter/src/pages/wilczki/[id]/edytuj.astro` | edytowany | Breadcrumb nawigacyjny + przycisk „Profil wilczka →" |
| `10x-astro-starter/src/pages/wilczki/[id]/rodzic/nowy.astro` | dodany | Strona formularza dodawania rodzica; guard serwer-side przy limicie |
| `10x-astro-starter/src/pages/wilczki/[id]/rodzic/[rodzic_id]/edytuj.astro` | dodany | Strona formularza edycji rodzica z przekazaniem listy istniejących rodziców |
| `10x-astro-starter/src/pages/api/rodzice/index.ts` | dodany | POST z walidacją limitu (max 2, max 1 matka, max 1 ojciec) |
| `10x-astro-starter/src/pages/api/rodzice/[id].ts` | dodany | PUT (walidacja konfliktu relacji) + DELETE |
| `10x-astro-starter/src/pages/wilczki/index.astro` | edytowany | Dodano link „Profil" w wierszu tabeli |
