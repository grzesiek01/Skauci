import { z } from "zod";

const currentYear = new Date().getFullYear();

export const skladkaBodySchema = z.object({
  wilczek_id: z.uuid("Nieprawidłowy ID wilczka"),
  rok: z
    .number({ invalid_type_error: "Rok musi być liczbą" })
    .int()
    .min(2000, "Rok nie może być wcześniejszy niż 2000")
    .max(currentYear + 1, `Rok nie może być późniejszy niż ${currentYear + 1}`),
  kwota: z.number({ invalid_type_error: "Kwota musi być liczbą" }).nonnegative().nullable().optional(),
  zaplacono: z.boolean().default(false),
  data_wplaty: z.string().nullable().optional(),
});

export const skladkaUpdateSchema = skladkaBodySchema.omit({ wilczek_id: true });
