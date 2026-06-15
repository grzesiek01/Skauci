import { z } from "zod";

export const wilczekSprawnosccBodySchema = z.object({
  wilczek_id: z.uuid("Nieprawidłowy ID wilczka"),
  sprawnosc_id: z.uuid("Nieprawidłowy ID sprawności"),
  data_uzyskania: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty")
    .nullable()
    .optional(),
});
