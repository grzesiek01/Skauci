import { useState } from "react";
import type { Funkcja, FunkcjaFormData } from "@/types";
import { isFutureIsoDate } from "@/lib/validators";

const FUNKCJE_NAMES = ["Szóstkowy", "Czołowy"] as const;

interface Props {
  wilczekId: string;
  funkcja?: Funkcja;
}

function toFormData(f: Funkcja): FunkcjaFormData {
  return { nazwa: f.nazwa, data_od: f.data_od, data_do: f.data_do ?? "" };
}

export default function FunkcjaForm({ wilczekId, funkcja }: Props) {
  const isEdit = Boolean(funkcja);
  const [form, setForm] = useState<FunkcjaFormData>(
    funkcja ? toFormData(funkcja) : { nazwa: FUNKCJE_NAMES[0], data_od: "", data_do: "" },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FunkcjaFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setField(field: keyof FunkcjaFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const next: typeof errors = {};
    if (!form.data_od) {
      next.data_od = "Data objęcia funkcji jest wymagana";
    } else if (isFutureIsoDate(form.data_od)) {
      next.data_od = "Data objęcia nie może być w przyszłości";
    }
    if (form.data_do) {
      if (form.data_od && form.data_do < form.data_od) {
        next.data_do = "Data zakończenia nie może być wcześniejsza niż data objęcia";
      } else if (isFutureIsoDate(form.data_do)) {
        next.data_do = "Data zakończenia nie może być w przyszłości";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError(null);

    const url = isEdit ? `/api/funkcje/${funkcja?.id}` : "/api/funkcje";
    const method = isEdit ? "PUT" : "POST";

    const body = {
      ...(isEdit ? {} : { wilczek_id: wilczekId }),
      nazwa: form.nazwa,
      data_od: form.data_od,
      data_do: form.data_do || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        window.location.href = `/wilczki/${wilczekId}?tab=funkcje`;
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
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Funkcja *</label>
        <select value={form.nazwa} onChange={setField("nazwa")} className={selectClass(false)}>
          {FUNKCJE_NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Data objęcia *" error={errors.data_od}>
          <input
            type="date"
            value={form.data_od}
            onChange={setField("data_od")}
            className={inputClass(!!errors.data_od)}
          />
        </Field>
        <Field label="Data zakończenia" error={errors.data_do}>
          <input
            type="date"
            value={form.data_do}
            onChange={setField("data_do")}
            className={inputClass(!!errors.data_do)}
          />
          <p className="mt-1 text-xs text-gray-400">Pozostaw puste jeśli funkcja jest aktualna</p>
        </Field>
      </div>

      {serverError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Dodaj funkcję"}
        </button>
        <a
          href={`/wilczki/${wilczekId}?tab=funkcje`}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          Anuluj
        </a>
      </div>
    </form>
  );
}

function selectClass(hasError: boolean) {
  return [
    "w-full rounded-md border px-3 py-2 text-sm text-gray-900",
    "focus:outline-none focus:ring-2",
    hasError ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-300 focus:border-green-500",
  ].join(" ");
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-md border px-3 py-2 text-sm text-gray-900",
    "focus:outline-none focus:ring-2",
    hasError ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-green-300 focus:border-green-500",
  ].join(" ");
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
