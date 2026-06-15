# Etap 2 — Schemat bazy danych

## Co zostało zrobione

- Zaprojektowano schemat 8 tabel dla aplikacji
- Napisano migrację SQL: `supabase/migrations/20260601000000_initial_schema.sql`
- Migracja wgrana do Supabase Cloud przez CLI (`npx supabase db push`)

## Tabele

| Tabela | Opis |
|---|---|
| `wilczki` | Dane osobowe wilczków (imię, nazwisko, PESEL, adres, data urodzenia) |
| `rodzice` | Dane i kontakt do rodziców/opiekunów, powiązani z wilczkiem |
| `sprawnosci` | Słownik dostępnych sprawności (nazwa, opis, kategoria) |
| `wilczek_sprawnosci` | Przypisanie sprawności do wilczka z datą uzyskania |
| `funkcje` | Funkcje pełnione w gromadzie (zastępowy itp.) z datami |
| `zbiorki` | Lista zbiórek (data, temat, miejsce) |
| `obecnosci` | Obecność wilczka na zbiórce (boolean) |
| `skladki` | Składki roczne per wilczek (rok, zapłacono, data wpłaty, kwota) |

## Decyzje

- **Składki roczne** — jedna składka per wilczek per rok (bez podziału na miesiące)
- **RLS włączone** na wszystkich tabelach — dostęp tylko dla zalogowanych użytkowników
- **on delete cascade** — usunięcie wilczka usuwa wszystkie powiązane dane
- **unique(wilczek_id, rok)** w składkach — jeden rekord składki per wilczek per rok
- **unique(zbiorka_id, wilczek_id)** w obecnościach — jeden rekord obecności per zbiórka per wilczek

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/supabase/migrations/20260601000000_initial_schema.sql` | dodany | Migracja SQL tworząca wszystkie 8 tabel z RLS i politykami dostępu |

## Komendy

```bash
npx supabase login --token <token>
npx supabase link --project-ref ksdbexbyxjpyaiuwclbs
npx supabase db push
```
