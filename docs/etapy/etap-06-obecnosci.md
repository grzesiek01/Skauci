# Etap 6 — Moduł obecności

## Co zostało zrobione

- Lista zbiórek `/zbiorki` — tabela z datą, tematem, miejscem; akcje: Obecności / Edytuj / Usuń
- Formularz dodawania zbiórki `/zbiorki/nowa` — po dodaniu automatyczny redirect do strony oznaczania obecności
- Formularz edycji zbiórki `/zbiorki/[id]/edytuj` z przyciskiem „Obecności →"
- Strona oznaczania obecności `/zbiorki/[id]/obecnosci` — lista wszystkich wilczków z checkboxami; przyciski „Zaznacz wszystkich" / „Odznacz wszystkich"; licznik obecnych
- Zapisywanie obecności przez bulk upsert (jeden POST dla całej zbiórki)
- Zakładka **Obecności** w profilu wilczka: tabela zbiórek z oznaczeniami (Obecny / Nieobecny / Nie oznaczono), podsumowanie frekwencji procentowej
- Link „Zbiórki" dodany do navbara (`AppLayout.astro`)

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/src/types.ts` | edytowany | Dodano interfejsy `Zbiorka`, `ZbiorkaFormData`, `Obecnosc` |
| `10x-astro-starter/src/lib/zbiorkaSchema.ts` | dodany | Schematy zod: `zbiorkaSchema` i `obecnosciSchema` |
| `10x-astro-starter/src/layouts/AppLayout.astro` | edytowany | Dodano link „Zbiórki" w nawigacji |
| `10x-astro-starter/src/pages/zbiorki/index.astro` | dodany | Lista zbiórek z akcjami Obecności / Edytuj / Usuń |
| `10x-astro-starter/src/pages/zbiorki/nowa.astro` | dodany | Strona formularza dodawania zbiórki |
| `10x-astro-starter/src/pages/zbiorki/[id]/edytuj.astro` | dodany | Strona formularza edycji zbiórki |
| `10x-astro-starter/src/pages/zbiorki/[id]/obecnosci.astro` | dodany | Strona oznaczania obecności dla całej grupy |
| `10x-astro-starter/src/components/zbiorki/ZbiorkaForm.tsx` | dodany | React: formularz add/edit zbiórki; po dodaniu redirect do strony obecności |
| `10x-astro-starter/src/components/zbiorki/ObecnosciForm.tsx` | dodany | React: lista wilczków z checkboxami, bulk upsert do API |
| `10x-astro-starter/src/pages/api/zbiorki/index.ts` | dodany | GET (lista) + POST (tworzenie, zwraca obiekt do redirect) |
| `10x-astro-starter/src/pages/api/zbiorki/[id].ts` | dodany | PUT (aktualizacja) + DELETE (usunięcie; kaskada usuwa obecności) |
| `10x-astro-starter/src/pages/api/zbiorki/[id]/obecnosci.ts` | dodany | POST — bulk upsert obecności dla zbiórki |
| `10x-astro-starter/src/pages/wilczki/[id]/index.astro` | edytowany | Zakładka Obecności: tabela z historią + frekwencja procentowa |
