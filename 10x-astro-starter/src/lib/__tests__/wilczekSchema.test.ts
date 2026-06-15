import { describe, expect, it } from "vitest";
import { wilczekSchema } from "@/lib/wilczekSchema";

const VALID_PESEL = "44051401458";

describe("wilczekSchema", () => {
  it("akceptuje minimalne dane (imię i nazwisko)", () => {
    const result = wilczekSchema.safeParse({ imie: "Jan", nazwisko: "Kowalski" });
    expect(result.success).toBe(true);
  });

  it("akceptuje pełne dane z prawidłowym PESEL i kodem pocztowym", () => {
    const result = wilczekSchema.safeParse({
      imie: "Jan",
      nazwisko: "Kowalski",
      pesel: VALID_PESEL,
      kod_pocztowy: "12-345",
      ulica: "Leśna 1",
      miasto: "Warszawa",
      szostka: "Biała",
    });
    expect(result.success).toBe(true);
  });

  it("akceptuje pola nullable jako null", () => {
    const result = wilczekSchema.safeParse({
      imie: "Jan",
      nazwisko: "Kowalski",
      pesel: null,
      kod_pocztowy: null,
      szostka: null,
    });
    expect(result.success).toBe(true);
  });

  it("odrzuca brak imienia", () => {
    const result = wilczekSchema.safeParse({ imie: "", nazwisko: "Kowalski" });
    expect(result.success).toBe(false);
  });

  it("odrzuca brak nazwiska", () => {
    const result = wilczekSchema.safeParse({ imie: "Jan", nazwisko: "" });
    expect(result.success).toBe(false);
  });

  it("odrzuca nieprawidłowy PESEL", () => {
    const result = wilczekSchema.safeParse({
      imie: "Jan",
      nazwisko: "Kowalski",
      pesel: "11111111111",
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca nieprawidłowy kod pocztowy", () => {
    const result = wilczekSchema.safeParse({
      imie: "Jan",
      nazwisko: "Kowalski",
      kod_pocztowy: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca szóstkę spoza słownika", () => {
    const result = wilczekSchema.safeParse({
      imie: "Jan",
      nazwisko: "Kowalski",
      szostka: "Zielona",
    });
    expect(result.success).toBe(false);
  });

  it.each(["Biała", "Szara", "Czarna", "Brunatna"] as const)("akceptuje szóstkę '%s'", (szostka) => {
    const result = wilczekSchema.safeParse({ imie: "Jan", nazwisko: "Kowalski", szostka });
    expect(result.success).toBe(true);
  });
});
