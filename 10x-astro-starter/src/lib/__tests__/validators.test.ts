import { describe, expect, it } from "vitest";
import {
  dataUrodzeniaToIso,
  isFutureIsoDate,
  isoToDataUrodzenia,
  isValidDataUrodzenia,
  isValidKodPocztowy,
  isValidPesel,
  isValidTelefon,
} from "@/lib/validators";

// PESEL 44051401458 — prawidłowy (suma kontrolna = 8)
const VALID_PESEL = "44051401458";

describe("isValidPesel", () => {
  it("akceptuje prawidłowy PESEL", () => {
    expect(isValidPesel(VALID_PESEL)).toBe(true);
  });

  it("odrzuca PESEL z błędną sumą kontrolną", () => {
    expect(isValidPesel("44051401450")).toBe(false);
  });

  it("odrzuca PESEL o długości 10 cyfr", () => {
    expect(isValidPesel("4405140145")).toBe(false);
  });

  it("odrzuca PESEL o długości 12 cyfr", () => {
    expect(isValidPesel("440514014580")).toBe(false);
  });

  it("odrzuca PESEL zawierający litery", () => {
    expect(isValidPesel("4405140145X")).toBe(false);
  });

  it("odrzuca pusty ciąg", () => {
    expect(isValidPesel("")).toBe(false);
  });
});

describe("isValidKodPocztowy", () => {
  it("akceptuje format XX-XXX", () => {
    expect(isValidKodPocztowy("12-345")).toBe(true);
    expect(isValidKodPocztowy("00-000")).toBe(true);
  });

  it("odrzuca format bez myślnika", () => {
    expect(isValidKodPocztowy("12345")).toBe(false);
  });

  it("odrzuca błędne położenie myślnika", () => {
    expect(isValidKodPocztowy("1-2345")).toBe(false);
    expect(isValidKodPocztowy("123-45")).toBe(false);
  });

  it("odrzuca litery", () => {
    expect(isValidKodPocztowy("AB-CDE")).toBe(false);
  });

  it("odrzuca pusty ciąg", () => {
    expect(isValidKodPocztowy("")).toBe(false);
  });
});

describe("isValidDataUrodzenia", () => {
  it("akceptuje prawidłową datę", () => {
    expect(isValidDataUrodzenia("01.01.2010")).toBe(true);
    expect(isValidDataUrodzenia("29.02.2000")).toBe(true); // rok przestępny
  });

  it("odrzuca 31 lutego", () => {
    expect(isValidDataUrodzenia("31.02.2000")).toBe(false);
  });

  it("odrzuca 29 lutego w roku nieprzestępnym", () => {
    expect(isValidDataUrodzenia("29.02.2001")).toBe(false);
  });

  it("odrzuca zerowe dni/miesiące", () => {
    expect(isValidDataUrodzenia("00.01.2000")).toBe(false);
    expect(isValidDataUrodzenia("01.00.2000")).toBe(false);
  });

  it("odrzuca błędny format (myślniki)", () => {
    expect(isValidDataUrodzenia("01-01-2010")).toBe(false);
  });

  it("odrzuca format ISO", () => {
    expect(isValidDataUrodzenia("2010-01-01")).toBe(false);
  });

  it("odrzuca pusty ciąg", () => {
    expect(isValidDataUrodzenia("")).toBe(false);
  });
});

describe("isValidTelefon", () => {
  it("akceptuje pusty ciąg (telefon nieobowiązkowy)", () => {
    expect(isValidTelefon("")).toBe(true);
    expect(isValidTelefon("   ")).toBe(true);
  });

  it("akceptuje 9 cyfr", () => {
    expect(isValidTelefon("123456789")).toBe(true);
  });

  it("akceptuje numer z prefiksem +48", () => {
    expect(isValidTelefon("+48123456789")).toBe(true);
  });

  it("akceptuje numer ze spacjami i myślnikami", () => {
    expect(isValidTelefon("123-456-789")).toBe(true);
    expect(isValidTelefon("123 456 789")).toBe(true);
  });

  it("odrzuca 8 cyfr", () => {
    expect(isValidTelefon("12345678")).toBe(false);
  });

  it("odrzuca 10 cyfr bez prefiksu", () => {
    expect(isValidTelefon("1234567890")).toBe(false);
  });

  it("odrzuca litery", () => {
    expect(isValidTelefon("12345678X")).toBe(false);
  });
});

describe("dataUrodzeniaToIso", () => {
  it("konwertuje DD.MM.RRRR na RRRR-MM-DD", () => {
    expect(dataUrodzeniaToIso("01.02.2003")).toBe("2003-02-01");
    expect(dataUrodzeniaToIso("31.12.1999")).toBe("1999-12-31");
  });
});

describe("isoToDataUrodzenia", () => {
  it("konwertuje RRRR-MM-DD na DD.MM.RRRR", () => {
    expect(isoToDataUrodzenia("2003-02-01")).toBe("01.02.2003");
    expect(isoToDataUrodzenia("1999-12-31")).toBe("31.12.1999");
  });

  it("konwersja jest wzajemnie odwracalna", () => {
    const original = "15.06.1990";
    expect(isoToDataUrodzenia(dataUrodzeniaToIso(original))).toBe(original);
  });
});

describe("isFutureIsoDate", () => {
  it("zwraca true dla daty w przyszłości", () => {
    expect(isFutureIsoDate("2099-01-01")).toBe(true);
  });

  it("zwraca false dla daty w przeszłości", () => {
    expect(isFutureIsoDate("2000-01-01")).toBe(false);
  });
});
