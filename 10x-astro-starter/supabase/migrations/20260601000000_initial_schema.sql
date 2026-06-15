-- Tabela wilczki
create table public.wilczki (
  id uuid primary key default gen_random_uuid(),
  imie text not null,
  nazwisko text not null,
  data_urodzenia date,
  pesel text unique,
  ulica text,
  miasto text,
  kod_pocztowy text,
  created_at timestamptz not null default now()
);

alter table public.wilczki enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.wilczki for all
  to authenticated
  using (true)
  with check (true);

-- Tabela rodzice
create table public.rodzice (
  id uuid primary key default gen_random_uuid(),
  wilczek_id uuid not null references public.wilczki(id) on delete cascade,
  imie text not null,
  nazwisko text not null,
  telefon text,
  email text,
  relacja text
);

alter table public.rodzice enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.rodzice for all
  to authenticated
  using (true)
  with check (true);

-- Tabela sprawnosci (slownik)
create table public.sprawnosci (
  id uuid primary key default gen_random_uuid(),
  nazwa text not null unique,
  opis text,
  kategoria text
);

alter table public.sprawnosci enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.sprawnosci for all
  to authenticated
  using (true)
  with check (true);

-- Tabela wilczek_sprawnosci (przypisania sprawnosci do wilczka)
create table public.wilczek_sprawnosci (
  id uuid primary key default gen_random_uuid(),
  wilczek_id uuid not null references public.wilczki(id) on delete cascade,
  sprawnosc_id uuid not null references public.sprawnosci(id) on delete cascade,
  data_uzyskania date,
  unique(wilczek_id, sprawnosc_id)
);

alter table public.wilczek_sprawnosci enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.wilczek_sprawnosci for all
  to authenticated
  using (true)
  with check (true);

-- Tabela funkcje
create table public.funkcje (
  id uuid primary key default gen_random_uuid(),
  wilczek_id uuid not null references public.wilczki(id) on delete cascade,
  nazwa text not null,
  data_od date not null,
  data_do date
);

alter table public.funkcje enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.funkcje for all
  to authenticated
  using (true)
  with check (true);

-- Tabela zbiorki
create table public.zbiorki (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  temat text,
  miejsce text,
  created_at timestamptz not null default now()
);

alter table public.zbiorki enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.zbiorki for all
  to authenticated
  using (true)
  with check (true);

-- Tabela obecnosci
create table public.obecnosci (
  id uuid primary key default gen_random_uuid(),
  zbiorka_id uuid not null references public.zbiorki(id) on delete cascade,
  wilczek_id uuid not null references public.wilczki(id) on delete cascade,
  obecny boolean not null default false,
  unique(zbiorka_id, wilczek_id)
);

alter table public.obecnosci enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.obecnosci for all
  to authenticated
  using (true)
  with check (true);

-- Tabela skladki (roczne)
create table public.skladki (
  id uuid primary key default gen_random_uuid(),
  wilczek_id uuid not null references public.wilczki(id) on delete cascade,
  rok integer not null,
  zaplacono boolean not null default false,
  data_wplaty date,
  kwota numeric,
  unique(wilczek_id, rok)
);

alter table public.skladki enable row level security;

create policy "Dostep tylko dla zalogowanych"
  on public.skladki for all
  to authenticated
  using (true)
  with check (true);
