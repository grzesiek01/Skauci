# Etap 7 — Moduł składek

## Co zostało zrobione

- Strona przeglądowa `/skladki` — widok zaległości per rok (dropdown zmiany roku); podsumowanie: łączna liczba wilczków, ilu zapłaciło, ilu nie; tabela ze statusem, kwotą i datą wpłaty; link do zakładki Składki w profilu
- Zakładka **Składki** w profilu wilczka: tabela rocznych składek (rok, status, kwota, data wpłaty) z akcjami Edytuj / Usuń; przycisk „+ Dodaj rok"
- Formularz dodawania składki `/wilczki/[id]/skladka/nowa` — pola: rok, kwota, data wpłaty, checkbox zaplacono; walidacja unikalności roku
- Formularz edycji składki `/wilczki/[id]/skladka/[skladka_id]/edytuj` — pole rok wyłączone (rok nie jest edytowalny)
- API `POST /api/skladki` — tworzenie z walidacją duplikatu (wilczek+rok unique)
- API `PUT /api/skladki/[id]` — aktualizacja
- API `DELETE /api/skladki/[id]` — usunięcie
- Link „Składki" dodany do navbara

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/src/types.ts` | edytowany | Dodano interfejsy `Skladka` i `SkladkaFormData` |
| `10x-astro-starter/src/lib/skladkaSchema.ts` | dodany | Schematy zod: `skladkaBodySchema` (POST) i `skladkaUpdateSchema` (PUT) |
| `10x-astro-starter/src/layouts/AppLayout.astro` | edytowany | Dodano link „Składki" w nawigacji |
| `10x-astro-starter/src/pages/skladki/index.astro` | dodany | Widok zaległości — tabela wszystkich wilczków z filtrem roku |
| `10x-astro-starter/src/components/wilczki/SkladkaForm.tsx` | dodany | React: formularz add/edit składki; rok zablokowany w trybie edycji |
| `10x-astro-starter/src/pages/wilczki/[id]/skladka/nowa.astro` | dodany | Strona formularza dodawania składki z guard unikalności |
| `10x-astro-starter/src/pages/wilczki/[id]/skladka/[skladka_id]/edytuj.astro` | dodany | Strona formularza edycji składki |
| `10x-astro-starter/src/pages/api/skladki/index.ts` | dodany | POST z walidacją duplikatu (wilczek+rok) |
| `10x-astro-starter/src/pages/api/skladki/[id].ts` | dodany | PUT (aktualizacja) + DELETE |
| `10x-astro-starter/src/pages/wilczki/[id]/index.astro` | edytowany | Zakładka Składki: tabela historii + ładowanie danych; obsługa usuwania |
