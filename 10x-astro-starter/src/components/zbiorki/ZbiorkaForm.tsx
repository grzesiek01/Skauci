import { useState } from "react";
import type { Zbiorka, ZbiorkaFormData } from "@/types";
import { isValidDataUrodzenia, isFutureIsoDate, dataUrodzeniaToIso, isoToDataUrodzenia } from "@/lib/validators";

interface Props {
  zbiorka?: Zbiorka;
}

const empty: ZbiorkaFormData = { data: "", temat: "", miejsce: "" };

function toFormData(z: Zbiorka): ZbiorkaFormData {
  return {
    data: z.data ? isoToDataUrodzenia(z.data) : "",
    temat: z.temat ?? "",
    miejsce: z.miejsce ?? "",
  };
}

export default function ZbiorkaForm({ zbiorka }: Props) {
  const isEdit = Boolean(zbiorka);
  const [form, setForm] = useState<ZbiorkaFormData>(zbiorka ? toFormData(zbiorka) : empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ZbiorkaFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set(field: keyof ZbiorkaFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const next: typeof errors = {};
    if (!form.data.trim()) {
      next.data = "Data jest wymagana";
    } else if (!isValidDataUrodzenia(form.data)) {
      next.data = "Nieprawidłowa data (format: DD.MM.RRRR)";
    } else if (isFutureIsoDate(dataUrodzeniaToIso(form.data))) {
      next.data = "Data nie może być w przyszłości";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setServerError(null);

    const url = isEdit ? `/api/zbiorki/${zbiorka?.id}` : "/api/zbiorki";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          data: dataUrodzeniaToIso(form.data),
        }),
      });

      if (res.ok) {
        if (isEdit) {
          window.location.href = "/zbiorki";
        } else {
          const created = (await res.json()) as { id: string };
          window.location.href = `/zbiorki/${created.id}/obecnosci`;
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Data *" error={errors.data}>
          <input
            type="text"
            value={form.data}
            onChange={set("data")}
            className={inputClass(!!errors.data)}
            placeholder="DD.MM.RRRR"
            maxLength={10}
          />
        </Field>
        <Field label="Miejsce" error={errors.miejsce}>
          <input
            type="text"
            value={form.miejsce}
            onChange={set("miejsce")}
            className={inputClass(false)}
            placeholder="np. Dom harcerza"
          />
        </Field>
        <Field label="Temat" error={errors.temat} className="sm:col-span-2">
          <input
            type="text"
            value={form.temat}
            onChange={set("temat")}
            className={inputClass(false)}
            placeholder="np. Gry terenowe"
          />
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
          {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Dodaj zbiórkę"}
        </button>
        <a href="/zbiorki" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
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
