/** Validates on POST/PUT endpoints */
import { z } from "zod";

export const CreateComponentValidator = z.object({
  name: z.string().min(3).max(32),
  content: z
    .object({
      type: z.string(),
      content: z.any(),
    })
    .array()
    .length(1),
});

export const UpdateComponentValidator = z.object({
  id: z.string(),
  name: z.string().min(3).max(32),
  content: z
    .object({
      type: z.string(),
      content: z.any(),
    })
    .array()
    .length(1),
});
