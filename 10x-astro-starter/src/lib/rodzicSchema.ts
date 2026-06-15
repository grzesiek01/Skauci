import { z } from "zod";

export const rodzicBodySchema = z.object({
  wilczek_id: z.uuid("Nieprawidłowy ID wilczka"),
  imie: z.string().min(1, "Imię jest wymagane"),
  nazwisko: z.string().min(1, "Nazwisko jest wymagane"),
  telefon: z.string().default(""),
  email: z.string().default(""),
  relacja: z.string().default(""),
});

export const rodzicUpdateSchema = rodzicBodySchema.omit({ wilczek_id: true });
