import { useState } from "react";
import type { Wilczek } from "@/types";

interface ObecnoscEntry {
  wilczek_id: string;
  obecny: boolean;
}

interface Props {
  zbiorkaId: string;
  wilczki: Wilczek[];
  initialObeznoscis: Record<string, boolean>;
}

export default function ObecnosciForm({ zbiorkaId, wilczki, initialObeznoscis }: Props) {
  const [obecnosci, setObecnosci] = useState<Record<string, boolean>>(
    Object.fromEntries(wilczki.map((w) => [w.id, initialObeznoscis[w.id] ?? false])),
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggle(wilczekId: string) {
    setObecnosci((prev) => ({ ...prev, [wilczekId]: !prev[wilczekId] }));
  }

  function setAll(value: boolean) {
    setObecnosci(Object.fromEntries(wilczki.map((w) => [w.id, value])));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSaving(true);
    setServerError(null);

    const body: { obecnosci: ObecnoscEntry[] } = {
      obecnosci: wilczki.map((w) => ({ wilczek_id: w.id, obecny: obecnosci[w.id] ?? false })),
    };

    try {
      const res = await fetch(`/api/zbiorki/${zbiorkaId}/obecnosci`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        window.location.href = "/zbiorki";
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

  const presentCount = Object.values(obecnosci).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Obecni: <span className="font-semibold text-gray-900">{presentCount}</span> / {wilczki.length}
        </p>
        <div className="flex gap-3 text-sm">
          <button
            type="button"
            onClick={() => {
              setAll(true);
            }}
            className="text-green-700 hover:underline"
          >
            Zaznacz wszystkich
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => {
              setAll(false);
            }}
            className="text-gray-500 hover:underline"
          >
            Odznacz wszystkich
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {wilczki.map((w) => (
          <label
            key={w.id}
            className="flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={obecnosci[w.id] ?? false}
              onChange={() => {
                toggle(w.id);
              }}
              className="h-4 w-4 rounded border-gray-300 accent-green-700"
            />
            <span className="font-medium text-gray-900">
              {w.imie} {w.nazwisko}
            </span>
          </label>
        ))}
      </div>

      {wilczki.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">Brak wilczków w bazie — dodaj najpierw wilczka.</p>
      )}

      {serverError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || wilczki.length === 0}
          className="rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Zapisywanie…" : "Zapisz obecności"}
        </button>
        <a href="/zbiorki" className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          Anuluj
        </a>
      </div>
    </form>
  );
}
