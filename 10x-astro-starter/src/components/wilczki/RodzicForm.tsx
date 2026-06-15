import { useState } from "react";
import type { Rodzic, RodzicFormData } from "@/types";
import { isValidTelefon } from "@/lib/validators";

interface Props {
  wilczekId: string;
  rodzic?: Rodzic;
  existingRodzice: Rodzic[];
}

const RELACJE = [
  { value: "", label: "— nie podano —" },
  { value: "matka", label: "Matka" },
  { value: "ojciec", label: "Ojciec" },
  { value: "opiekun", label: "Opiekun" },
];

const empty: RodzicFormData = {
  imie: "",
  nazwisko: "",
  telefon: "",
  email: "",
  relacja: "",
};

function toFormData(r: Rodzic): RodzicFormData {
  return {
    imie: r.imie,
    nazwisko: r.nazwisko,
    telefon: r.telefon ?? "",
    email: r.email ?? "",
    relacja: r.relacja ?? "",
  };
}

function checkRelacjaLimit(relacja: string, existingRodzice: Rodzic[], currentId?: string): string | null {
  const others = existingRodzice.filter((r) => r.id !== currentId);

  if (!currentId && others.length >= 2) {
    return "Wilczek może mieć maksymalnie dwoje rodziców / opiekunów.";
  }
  if (relacja === "matka" && others.some((r) => r.relacja === "matka")) {
    return "Wilczek ma już przypisaną matkę.";
  }
  if (relacja === "ojciec" && others.some((r) => r.relacja === "ojciec")) {
    return "Wilczek ma już przypisanego ojca.";
  }
  return null;
}

export default function RodzicForm({ wilczekId, rodzic, existingRodzice }: Props) {
  const isEdit = Boolean(rodzic);
  const [form, setForm] = useState<RodzicFormData>(rodzic ? toFormData(rodzic) : empty);
  const [errors, setErrors] = useState<Partial<Record<keyof RodzicFormData | "relacja_limit", string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set(field: keyof RodzicFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, relacja_limit: undefined }));
    };
  }

  function validate() {
    const next: typeof errors = {};
    if (!form.imie.trim()) next.imie = "Imię jest wymagane";
    if (!form.nazwisko.trim()) next.nazwisko = "Nazwisko jest wymagane";
    if (!isValidTelefon(form.telefon))
      next.telefon = "Nieprawidłowy numer telefonu (format: 9 cyfr, opcjonalnie poprzedzony +48)";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Nieprawidłowy adres e-mail";

    const limitError = checkRelacjaLimit(form.relacja, existingRodzice, rodzic?.id);
    if (limitError) next.relacja_limit = limitError;

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setServerError(null);

    const url = isEdit ? `/api/rodzice/${rodzic?.id}` : "/api/rodzice";
    const method = isEdit ? "PUT" : "POST";
    const body = isEdit ? form : { ...form, wilczek_id: wilczekId };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        window.location.href = `/wilczki/${wilczekId}?tab=dane`;
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
        <Field label="Imię *" error={errors.imie}>
          <input
            type="text"
            value={form.imie}
            onChange={set("imie")}
            className={inputClass(!!errors.imie)}
            placeholder="Anna"
          />
        </Field>
        <Field label="Nazwisko *" error={errors.nazwisko}>
          <input
            type="text"
            value={form.nazwisko}
            onChange={set("nazwisko")}
            className={inputClass(!!errors.nazwisko)}
            placeholder="Kowalska"
          />
        </Field>
        <Field label="Relacja" error={errors.relacja_limit}>
          <select value={form.relacja} onChange={set("relacja")} className={inputClass(!!errors.relacja_limit)}>
            {RELACJE.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Telefon" error={errors.telefon}>
          <input
            type="tel"
            value={form.telefon}
            onChange={set("telefon")}
            className={inputClass(!!errors.telefon)}
            placeholder="600 000 000"
          />
        </Field>
        <Field label="E-mail" error={errors.email} className="sm:col-span-2">
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            className={inputClass(!!errors.email)}
            placeholder="anna@example.com"
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
          {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Dodaj rodzica"}
        </button>
        <a
          href={`/wilczki/${wilczekId}?tab=dane`}
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
