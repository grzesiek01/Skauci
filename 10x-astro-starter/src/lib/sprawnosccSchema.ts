import { z } from "zod";

export const sprawnosccBodySchema = z.object({
  nazwa: z.string().min(1, "Nazwa jest wymagana").max(100, "Nazwa zbyt długa"),
  opis: z.string().max(500, "Opis zbyt długi").nullable().optional(),
  kategoria: z.string().min(1, "Kategoria jest wymagana").max(50, "Kategoria zbyt długa").nullable().optional(),
});

export const sprawnosccUpdateSchema = sprawnosccBodySchema;
