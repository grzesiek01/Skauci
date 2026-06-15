import { z } from "zod";

export const FUNKCJE_NAMES = ["Szóstkowy", "Czołowy"] as const;

export const funkcjaBodySchema = z.object({
  wilczek_id: z.uuid("Nieprawidłowy ID wilczka"),
  nazwa: z.enum(FUNKCJE_NAMES, { error: "Nieprawidłowa nazwa funkcji" }),
  data_od: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty"),
  data_do: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty")
    .nullable()
    .optional(),
});

export const funkcjaUpdateSchema = funkcjaBodySchema.omit({ wilczek_id: true });
