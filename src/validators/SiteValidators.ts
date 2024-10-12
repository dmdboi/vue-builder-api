/** Validates on POST/PUT endpoints */
import { z } from "zod";

export const CreateSiteValidator = z.object({
  name: z.string().min(3).max(32),
  domain: z.string().min(3),
  favicon: z.string().min(3),
  meta: z
    .object({
      description: z.string(),
      keywords: z.string(),
      image: z.string(),
      author: z.string(),
    })
    .optional(),
});

export const UpdateSiteValidator = z.object({
  id: z.string(),
  name: z.string().min(3).max(32),
  domain: z.string().min(3),
  favicon: z.string().min(3),
  meta: z
    .object({
      description: z.string(),
      keywords: z.string(),
      image: z.string(),
      author: z.string(),
    })
    .optional(),
});
