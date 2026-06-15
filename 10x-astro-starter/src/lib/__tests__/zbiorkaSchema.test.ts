import { describe, expect, it } from "vitest";
import { obecnosciSchema, zbiorkaSchema } from "@/lib/zbiorkaSchema";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("zbiorkaSchema", () => {
  it("akceptuje zbiorkę z samą datą", () => {
    const result = zbiorkaSchema.safeParse({ data: "2025-06-15" });
    expect(result.success).toBe(true);
  });

  it("akceptuje pełne dane zbiórki", () => {
    const result = zbiorkaSchema.safeParse({
      data: "2025-06-15",
      temat: "Letni biwak",
      miejsce: "Las Bielański",
    });
    expect(result.success).toBe(true);
  });

  it("uzupełnia domyślnie puste temat i miejsce", () => {
    const result = zbiorkaSchema.safeParse({ data: "2025-06-15" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.temat).toBe("");
      expect(result.data.miejsce).toBe("");
    }
  });

  it("odrzuca brak daty", () => {
    const result = zbiorkaSchema.safeParse({ data: "" });
    expect(result.success).toBe(false);
  });

  it("odrzuca brak pola data", () => {
    const result = zbiorkaSchema.safeParse({ temat: "Biwak" });
    expect(result.success).toBe(false);
  });
});

describe("obecnosciSchema", () => {
  it("akceptuje pustą listę obecności", () => {
    const result = obecnosciSchema.safeParse({ obecnosci: [] });
    expect(result.success).toBe(true);
  });

  it("akceptuje listę z poprawnymi wpisami", () => {
    const result = obecnosciSchema.safeParse({
      obecnosci: [
        { wilczek_id: VALID_UUID, obecny: true },
        { wilczek_id: VALID_UUID, obecny: false },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("odrzuca wpis z nieprawidłowym UUID", () => {
    const result = obecnosciSchema.safeParse({
      obecnosci: [{ wilczek_id: "nie-uuid", obecny: true }],
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca wpis bez pola obecny", () => {
    const result = obecnosciSchema.safeParse({
      obecnosci: [{ wilczek_id: VALID_UUID }],
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca brak pola obecnosci", () => {
    const result = obecnosciSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
