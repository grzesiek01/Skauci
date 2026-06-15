import { useState } from "react";
import type { Skladka, SkladkaFormData } from "@/types";
import { isValidDataUrodzenia, isFutureIsoDate, dataUrodzeniaToIso, isoToDataUrodzenia } from "@/lib/validators";

interface Props {
  wilczekId: string;
  skladka?: Skladka;
  existingLata: number[];
}

const currentYear = new Date().getFullYear();
const todayFormatted = isoToDataUrodzenia(new Date().toISOString().split("T")[0]);

function toFormData(s: Skladka): SkladkaFormData {
  return {
    rok: String(s.rok),
    kwota: s.kwota != null ? String(s.kwota) : "",
    zaplacono: s.zaplacono,
    data_wplaty: s.data_wplaty ? isoToDataUrodzenia(s.data_wplaty) : "",
  };
}

export default function SkladkaForm({ wilczekId, skladka, existingLata }: Props) {
  const isEdit = Boolean(skladka);
  const [form, setForm] = useState<SkladkaFormData>(
    skladka
      ? toFormData(skladka)
      : { rok: String(currentYear), kwota: "", zaplacono: false, data_wplaty: todayFormatted },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof SkladkaFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setField(field: keyof SkladkaFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === "zaplacono" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const next: typeof errors = {};
    const rok = parseInt(form.rok, 10);
    if (!form.rok || isNaN(rok)) {
      next.rok = "Rok jest wymagany";
    } else if (rok < 2000 || rok > currentYear + 1) {
      next.rok = `Rok musi być między 2000 a ${currentYear + 1}`;
    } else if (!isEdit && existingLata.includes(rok)) {
      next.rok = `Składka za rok ${rok} już istnieje`;
    }
    if (form.kwota && isNaN(parseFloat(form.kwota))) {
      next.kwota = "Kwota musi być liczbą";
    }
    if (form.data_wplaty) {
      if (!isValidDataUrodzenia(form.data_wplaty)) {
        next.data_wplaty = "Nieprawidłowa data (format: DD.MM.RRRR)";
      } else if (isFutureIsoDate(dataUrodzeniaToIso(form.data_wplaty))) {
        next.data_wplaty = "Data wpłaty nie może być w przyszłości";
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

    const url = isEdit ? `/api/skladki/${skladka?.id}` : "/api/skladki";
    const method = isEdit ? "PUT" : "POST";

    const body = {
      ...(isEdit ? {} : { wilczek_id: wilczekId }),
      rok: parseInt(form.rok, 10),
      kwota: form.kwota ? parseFloat(form.kwota) : null,
      zaplacono: form.zaplacono,
      data_wplaty: form.data_wplaty ? dataUrodzeniaToIso(form.data_wplaty) : null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        window.location.href = `/wilczki/${wilczekId}?tab=skladki`;
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
        <Field label="Rok *" error={errors.rok}>
          <input
            type="number"
            value={form.rok}
            onChange={setField("rok")}
            className={inputClass(!!errors.rok)}
            min={2000}
            max={currentYear + 1}
            disabled={isEdit}
          />
        </Field>
        <Field label="Kwota (zł)" error={errors.kwota}>
          <input
            type="number"
            value={form.kwota}
            onChange={setField("kwota")}
            className={inputClass(!!errors.kwota)}
            placeholder="np. 60"
            min={0}
            step="0.01"
          />
        </Field>
        <Field label="Data wpłaty" error={errors.data_wplaty}>
          <input
            type="text"
            value={form.data_wplaty}
            onChange={setField("data_wplaty")}
            className={inputClass(!!errors.data_wplaty)}
            placeholder="DD.MM.RRRR"
            maxLength={10}
          />
        </Field>
        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.zaplacono}
              onChange={setField("zaplacono")}
              className="h-4 w-4 rounded border-gray-300 accent-green-700"
            />
            <span className="text-sm font-medium text-gray-700">Zapłacono</span>
          </label>
        </div>
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
          {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Dodaj składkę"}
        </button>
        <a
          href={`/wilczki/${wilczekId}?tab=skladki`}
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
