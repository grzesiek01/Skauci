import { useState } from "react";
import type { Wilczek, WilczekFormData } from "@/types";

const SZOSTKI = ["Biała", "Szara", "Czarna", "Brunatna"] as const;
import {
  isValidPesel,
  isValidKodPocztowy,
  isValidDataUrodzenia,
  isFutureIsoDate,
  dataUrodzeniaToIso,
  isoToDataUrodzenia,
} from "@/lib/validators";

interface Props {
  wilczek?: Wilczek;
}

const empty: WilczekFormData = {
  imie: "",
  nazwisko: "",
  data_urodzenia: "",
  pesel: "",
  ulica: "",
  miasto: "",
  kod_pocztowy: "",
  szostka: "",
};

function toFormData(w: Wilczek): WilczekFormData {
  return {
    imie: w.imie,
    nazwisko: w.nazwisko,
    data_urodzenia: w.data_urodzenia ? isoToDataUrodzenia(w.data_urodzenia) : "",
    pesel: w.pesel ?? "",
    ulica: w.ulica ?? "",
    miasto: w.miasto ?? "",
    kod_pocztowy: w.kod_pocztowy ?? "",
    szostka: w.szostka ?? "",
  };
}

export default function WilczekForm({ wilczek }: Props) {
  const isEdit = Boolean(wilczek);
  const [form, setForm] = useState<WilczekFormData>(wilczek ? toFormData(wilczek) : empty);
  const [errors, setErrors] = useState<Partial<Record<keyof WilczekFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set(field: keyof WilczekFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const next: typeof errors = {};
    if (!form.imie.trim()) next.imie = "Imię jest wymagane";
    if (!form.nazwisko.trim()) next.nazwisko = "Nazwisko jest wymagane";
    if (form.data_urodzenia) {
      if (!isValidDataUrodzenia(form.data_urodzenia)) {
        next.data_urodzenia = "Nieprawidłowa data (format: DD.MM.RRRR)";
      } else if (isFutureIsoDate(dataUrodzeniaToIso(form.data_urodzenia))) {
        next.data_urodzenia = "Data urodzenia nie może być w przyszłości";
      }
    }
    if (form.pesel && !isValidPesel(form.pesel)) next.pesel = "Nieprawidłowy numer PESEL";
    if (form.kod_pocztowy && !isValidKodPocztowy(form.kod_pocztowy))
      next.kod_pocztowy = "Nieprawidłowy kod pocztowy (format: XX-XXX)";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setServerError(null);

    const url = isEdit ? `/api/wilczki/${wilczek?.id}` : "/api/wilczki";
    const method = isEdit ? "PUT" : "POST";

    try {
      const body = {
        ...form,
        data_urodzenia: form.data_urodzenia ? dataUrodzeniaToIso(form.data_urodzenia) : "",
        szostka: form.szostka || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (isEdit) {
          window.location.href = `/wilczki/${wilczek?.id}`;
        } else {
          window.location.href = "/wilczki";
        }
      } else {
        const data = (await res.json()) as { error?: unknown };
        setServerError(typeof data.error === "string" ? data.error : "Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch {
      setServerError("Błąd sieci. Sprawdź połączenie i spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">Dane osobowe</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Imię *" error={errors.imie}>
            <input
              type="text"
              value={form.imie}
              onChange={set("imie")}
              className={inputClass(!!errors.imie)}
              placeholder="Jan"
            />
          </Field>
          <Field label="Nazwisko *" error={errors.nazwisko}>
            <input
              type="text"
              value={form.nazwisko}
              onChange={set("nazwisko")}
              className={inputClass(!!errors.nazwisko)}
              placeholder="Kowalski"
            />
          </Field>
          <Field label="Data urodzenia" error={errors.data_urodzenia}>
            <input
              type="text"
              value={form.data_urodzenia}
              onChange={set("data_urodzenia")}
              className={inputClass(!!errors.data_urodzenia)}
              placeholder="DD.MM.RRRR"
              maxLength={10}
            />
          </Field>
          <Field label="PESEL" error={errors.pesel}>
            <input
              type="text"
              value={form.pesel}
              onChange={set("pesel")}
              className={inputClass(false)}
              placeholder="00000000000"
              maxLength={11}
            />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">Szóstka</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Szóstka">
            <select value={form.szostka} onChange={set("szostka")} className={inputClass(false)}>
              <option value="">— brak przypisania —</option>
              {SZOSTKI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">Adres</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ulica" error={errors.ulica} className="sm:col-span-2">
            <input
              type="text"
              value={form.ulica}
              onChange={set("ulica")}
              className={inputClass(false)}
              placeholder="ul. Przykładowa 1"
            />
          </Field>
          <Field label="Miejscowość" error={errors.miasto}>
            <input
              type="text"
              value={form.miasto}
              onChange={set("miasto")}
              className={inputClass(false)}
              placeholder="Warszawa"
            />
          </Field>
          <Field label="Kod pocztowy" error={errors.kod_pocztowy}>
            <input
              type="text"
              value={form.kod_pocztowy}
              onChange={set("kod_pocztowy")}
              className={inputClass(false)}
              placeholder="00-000"
            />
          </Field>
        </div>
      </section>

      {serverError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Dodaj wilczka"}
        </button>
        <a
          href={isEdit ? `/wilczki/${wilczek?.id}` : "/wilczki"}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          Anuluj
        </a>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400",
    "focus:outline-none focus:ring-2",
    hasError ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-300 focus:border-green-500",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
