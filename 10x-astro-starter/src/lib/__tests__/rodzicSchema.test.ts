import { describe, expect, it } from "vitest";
import { rodzicBodySchema, rodzicUpdateSchema } from "@/lib/rodzicSchema";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("rodzicBodySchema", () => {
  it("akceptuje minimalne dane z poprawnym UUID", () => {
    const result = rodzicBodySchema.safeParse({
      wilczek_id: VALID_UUID,
      imie: "Anna",
      nazwisko: "Nowak",
    });
    expect(result.success).toBe(true);
  });

  it("uzupełnia domyślnie puste telefon, email, relacja", () => {
    const result = rodzicBodySchema.safeParse({
      wilczek_id: VALID_UUID,
      imie: "Anna",
      nazwisko: "Nowak",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.telefon).toBe("");
      expect(result.data.email).toBe("");
      expect(result.data.relacja).toBe("");
    }
  });

  it("akceptuje pełne dane z relacją", () => {
    const result = rodzicBodySchema.safeParse({
      wilczek_id: VALID_UUID,
      imie: "Anna",
      nazwisko: "Nowak",
      telefon: "123456789",
      email: "anna@example.com",
      relacja: "matka",
    });
    expect(result.success).toBe(true);
  });

  it("odrzuca brak imienia", () => {
    const result = rodzicBodySchema.safeParse({
      wilczek_id: VALID_UUID,
      imie: "",
      nazwisko: "Nowak",
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca brak nazwiska", () => {
    const result = rodzicBodySchema.safeParse({
      wilczek_id: VALID_UUID,
      imie: "Anna",
      nazwisko: "",
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca nieprawidłowy UUID wilczka", () => {
    const result = rodzicBodySchema.safeParse({
      wilczek_id: "nie-jest-uuid",
      imie: "Anna",
      nazwisko: "Nowak",
    });
    expect(result.success).toBe(false);
  });

  it("odrzuca brak wilczek_id", () => {
    const result = rodzicBodySchema.safeParse({
      imie: "Anna",
      nazwisko: "Nowak",
    });
    expect(result.success).toBe(false);
  });
});

describe("rodzicUpdateSchema", () => {
  it("akceptuje dane bez wilczek_id", () => {
    const result = rodzicUpdateSchema.safeParse({
      imie: "Anna",
      nazwisko: "Nowak",
    });
    expect(result.success).toBe(true);
  });

  it("odrzuca brak imienia", () => {
    const result = rodzicUpdateSchema.safeParse({ imie: "", nazwisko: "Nowak" });
    expect(result.success).toBe(false);
  });
});
