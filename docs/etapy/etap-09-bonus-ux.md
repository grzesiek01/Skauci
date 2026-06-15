# Etap 9 (bonus) — Ulepszenia UX: sortowanie, filtrowanie, walidacja dat, rozwijane sprawności

## Co zostało zrobione

### Sortowanie na liście wilczków

- Klikalne nagłówki kolumn: **Imię i nazwisko**, **Szóstka**, **Funkcja**, **Data urodzenia**
- Aktywna kolumna oznaczona strzałką `↑` / `↓`; nieaktywne pokazują `↕`
- Parametry `?sort=col&dir=asc/desc` w URL — sortowanie działa bez JavaScript
- Kolumny `nazwisko`, `szostka`, `data_urodzenia` sortowane przez Supabase; `funkcja` sortowana w JS po scaleniu danych z obu zapytań

### Sortowanie w panelu składek

- Klikalne nagłówki: **Wilczek**, **Status**, **Kwota**, **Data wpłaty**
- Sortowanie po stronie JS po scaleniu wilczków i składek (dane z dwóch zapytań)
- Domyślny sort: wilczek rosnąco; pierwsze kliknięcie Status/Kwota/Data wpłaty sortuje malejąco
- Zmiana roku w select kasuje aktywny sort

### Filtrowanie w panelu zbiórek

- Pole tekstowe szukające jednocześnie po `temat` i `miejsce` (case-insensitive `ilike` w Supabase)
- Dwa date pickery: **Od** / **Do** — każde pole działa niezależnie
- Formularz GET — filtry trafiają do URL, bezpośredni link do przefiltrowanego widoku
- Link **Wyczyść** pojawia się tylko gdy jakiś filtr jest aktywny
- Pusta lista rozróżnia brak wyników filtrowania od pustej bazy

### Walidacja dat — zakaz dat przyszłych

- Nowy helper `isFutureIsoDate(iso: string)` w `validators.ts` — porównanie ISO string z dzisiejszą datą
- Walidacja dodana do wszystkich formularzy z polami daty:
  - **ZbiorkaForm** — data zbiórki
  - **WilczekForm** — data urodzenia
  - **SkladkaForm** — data wpłaty
  - **FunkcjaForm** — data objęcia i data zakończenia funkcji
  - **WilczekSprawnosccForm** — data uzyskania sprawności

### Rozwijane sprawności z listą posiadaczy

- Przycisk `▶` przy każdej sprawności; kliknięcie rozwija wiersz (zmienia się na `▼`)
- W rozwiniętym wierszu: lista wilczków jako "chipy" z imieniem, nazwiskiem i datą uzyskania
- Kliknięcie chipu przenosi na zakładkę Sprawności profilu danego wilczka
- Liczba posiadaczy (`X wilczków`) widoczna w wierszu przed rozwinięciem
- Gdy nikt nie ma sprawności: komunikat „Żaden wilczek nie posiada tej sprawności"
- Dane pobierane jednym dodatkowym zapytaniem przy ładowaniu strony (bez lazy-loading)

## Pliki dodane / edytowane

| Plik | Operacja | Opis |
|---|---|---|
| `10x-astro-starter/src/pages/wilczki/index.astro` | edytowany | Klikalne nagłówki kolumn z sortowaniem przez URL params |
| `10x-astro-starter/src/pages/skladki/index.astro` | edytowany | Klikalne nagłówki kolumn, sortowanie w JS po scaleniu danych |
| `10x-astro-starter/src/pages/zbiorki/index.astro` | edytowany | Formularz filtrowania: wyszukiwanie tekstowe + przedział dat |
| `10x-astro-starter/src/lib/validators.ts` | edytowany | Dodano `isFutureIsoDate(iso)` |
| `10x-astro-starter/src/components/zbiorki/ZbiorkaForm.tsx` | edytowany | Walidacja: data zbiórki nie może być w przyszłości |
| `10x-astro-starter/src/components/wilczki/WilczekForm.tsx` | edytowany | Walidacja: data urodzenia nie może być w przyszłości |
| `10x-astro-starter/src/components/wilczki/SkladkaForm.tsx` | edytowany | Walidacja: data wpłaty nie może być w przyszłości |
| `10x-astro-starter/src/components/wilczki/FunkcjaForm.tsx` | edytowany | Walidacja: data objęcia i zakończenia funkcji nie mogą być w przyszłości |
| `10x-astro-starter/src/components/wilczki/WilczekSprawnosccForm.tsx` | edytowany | Walidacja: data uzyskania sprawności nie może być w przyszłości |
| `10x-astro-starter/src/pages/sprawnosci/index.astro` | edytowany | Rozwijane wiersze z listą wilczków posiadających daną sprawność |
| `docs/etapy/etap-09-bonus-ux.md` | dodany | Dokumentacja etapu bonusowego |
