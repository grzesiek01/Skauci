import { z } from "zod";
import { isValidPesel, isValidKodPocztowy } from "@/lib/validators";

const SZOSTKI = ["Biała", "Szara", "Czarna", "Brunatna"] as const;

export const wilczekSchema = z.object({
  imie: z.string().min(1, "Imię jest wymagane"),
  nazwisko: z.string().min(1, "Nazwisko jest wymagane"),
  data_urodzenia: z.string().optional().nullable(),
  pesel: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || isValidPesel(val), "Nieprawidłowy numer PESEL"),
  ulica: z.string().optional().nullable(),
  miasto: z.string().optional().nullable(),
  kod_pocztowy: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || isValidKodPocztowy(val), "Nieprawidłowy kod pocztowy (format: XX-XXX)"),
  szostka: z.enum(SZOSTKI).optional().nullable(),
});

export { SZOSTKI };
