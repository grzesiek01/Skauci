import { z } from "zod";

export const zbiorkaSchema = z.object({
  data: z.string().min(1, "Data jest wymagana"),
  temat: z.string().default(""),
  miejsce: z.string().default(""),
});

export const obecnosciSchema = z.object({
  obecnosci: z.array(
    z.object({
      wilczek_id: z.uuid(),
      obecny: z.boolean(),
    }),
  ),
});
