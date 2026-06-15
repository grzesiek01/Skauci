import { useState } from "react";
import type { Sprawnosc, SprawnosccFormData } from "@/types";

interface Props {
  sprawnosc?: Sprawnosc;
  existingKategorie: string[];
  redirectTo: string;
}

function toFormData(s: Sprawnosc): SprawnosccFormData {
  return { nazwa: s.nazwa, opis: s.opis ?? "", kategoria: s.kategoria ?? "" };
}

export default function SprawnosccForm({ sprawnosc, existingKategorie, redirectTo }: Props) {
  const isEdit = Boolean(sprawnosc);
  const [form, setForm] = useState<SprawnosccFormData>(
    sprawnosc ? toFormData(sprawnosc) : { nazwa: "", opis: "", kategoria: "" },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof SprawnosccFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function setField(field: keyof SprawnosccFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const next: typeof errors = {};
    if (!form.nazwa.trim()) next.nazwa = "Nazwa jest wymagana";
    else if (form.nazwa.length > 100) next.nazwa = "Nazwa zbyt długa (max 100 znaków)";
    if (!form.kategoria.trim()) next.kategoria = "Kategoria jest wymagana";
    if (form.opis.length > 500) next.opis = "Opis zbyt długi (max 500 znaków)";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError(null);

    const url = isEdit ? `/api/sprawnosci/${sprawnosc?.id}` : "/api/sprawnosci";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nazwa: form.nazwa.trim(),
          opis: form.opis.trim() || null,
          kategoria: form.kategoria.trim(),
        }),
      });

      if (res.ok) {
        window.location.href = redirectTo;
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
      <Field label="Nazwa *" error={errors.nazwa}>
        <input
          type="text"
          value={form.nazwa}
          onChange={setField("nazwa")}
          className={inputClass(!!errors.nazwa)}
          placeholder="np. Znawca przyrody"
          maxLength={100}
          autoFocus
        />
      </Field>

      <Field label="Kategoria *" error={errors.kategoria}>
        <input
          list="kategorie-list"
          value={form.kategoria}
          onChange={setField("kategoria")}
          className={inputClass(!!errors.kategoria)}
          maxLength={50}
        />
        <datalist id="kategorie-list">
          {existingKategorie.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
      </Field>

      <Field label="Opis" error={errors.opis}>
        <textarea
          value={form.opis}
          onChange={setField("opis")}
          className={inputClass(!!errors.opis) + " resize-none"}
          placeholder="Opcjonalny opis sprawności"
          rows={3}
          maxLength={500}
        />
      </Field>

      {serverError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Dodaj sprawność"}
        </button>
        <a href={redirectTo} className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
