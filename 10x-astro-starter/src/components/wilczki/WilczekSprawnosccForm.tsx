import { useState } from "react";
import type { Sprawnosc } from "@/types";
import { isFutureIsoDate } from "@/lib/validators";

interface Props {
  wilczekId: string;
  sprawnosci: Sprawnosc[];
  assignedIds: string[];
}

export default function WilczekSprawnosccForm({ wilczekId, sprawnosci, assignedIds }: Props) {
  const available = sprawnosci.filter((s) => !assignedIds.includes(s.id));
  const [sprawnosccId, setSprawnosccId] = useState(available[0]?.id ?? "");
  const [dataUzyskania, setDataUzyskania] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categories = [...new Set(available.map((s) => s.kategoria ?? "Inne"))].sort();

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!sprawnosccId) {
      setError("Wybierz sprawność");
      return;
    }
    if (dataUzyskania && isFutureIsoDate(dataUzyskania)) {
      setDateError("Data uzyskania nie może być w przyszłości");
      return;
    }
    setSaving(true);
    setError(null);
    setDateError(null);

    try {
      const res = await fetch("/api/wilczek-sprawnosci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wilczek_id: wilczekId,
          sprawnosc_id: sprawnosccId,
          data_uzyskania: dataUzyskania || null,
        }),
      });

      if (res.ok) {
        window.location.href = `/wilczki/${wilczekId}?tab=sprawnosci`;
      } else {
        const data = (await res.json()) as { error?: unknown };
        setError(typeof data.error === "string" ? data.error : "Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch {
      setError("Błąd sieci. Sprawdź połączenie i spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  }

  if (available.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
        Wszystkie sprawności ze słownika są już przypisane do tego wilczka.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Sprawność *</label>
        <select
          value={sprawnosccId}
          onChange={(e) => {
            setSprawnosccId(e.target.value);
            setError(null);
          }}
          className={selectClass(!!error)}
        >
          {categories.map((kat) => (
            <optgroup key={kat} label={kat}>
              {available
                .filter((s) => (s.kategoria ?? "Inne") === kat)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nazwa}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Data uzyskania</label>
        <input
          type="date"
          value={dataUzyskania}
          onChange={(e) => {
            setDataUzyskania(e.target.value);
            setDateError(null);
          }}
          className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:outline-none ${dateError ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:border-green-500 focus:ring-green-300"}`}
        />
        {dateError && <p className="mt-1 text-xs text-red-600">{dateError}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Zapisywanie…" : "Przypisz sprawność"}
        </button>
        <a
          href={`/wilczki/${wilczekId}?tab=sprawnosci`}
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
