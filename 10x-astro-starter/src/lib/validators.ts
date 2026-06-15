export function isValidPesel(pesel: string): boolean {
  if (!/^\d{11}$/.test(pesel)) return false;
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const digits = pesel.split("").map(Number);
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0);
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[10];
}

export function isValidKodPocztowy(kod: string): boolean {
  return /^\d{2}-\d{3}$/.test(kod);
}

export function isValidDataUrodzenia(val: string): boolean {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(val)) return false;
  const [day, month, year] = val.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function isValidTelefon(telefon: string): boolean {
  if (!telefon.trim()) return true;
  const cleaned = telefon.replace(/[\s\-().]/g, "");
  return /^(\+48)?\d{9}$/.test(cleaned);
}

// DD.MM.RRRR → RRRR-MM-DD (format ISO do bazy)
export function dataUrodzeniaToIso(val: string): string {
  const [day, month, year] = val.split(".");
  return `${year}-${month}-${day}`;
}

// RRRR-MM-DD → DD.MM.RRRR (format wyświetlany w formularzu)
export function isoToDataUrodzenia(val: string): string {
  const [year, month, day] = val.split("-");
  return `${day}.${month}.${year}`;
}

export function isFutureIsoDate(iso: string): boolean {
  return iso > new Date().toISOString().split("T")[0];
}
