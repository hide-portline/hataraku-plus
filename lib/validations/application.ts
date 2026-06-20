import { z } from "zod";

const uuidSchema = z.string().uuid("無効なIDです");

const applicationStatusEnum = z.enum([
  "applied",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
]);

export const applyToJobSchema = z.object({
  jobId: uuidSchema,
  message: z.string().max(2000).optional().transform((v) => v || undefined),
});

export const updateStatusSchema = z.object({
  applicationId: uuidSchema,
  status: applicationStatusEnum,
});

export type ApplyToJobInput = z.infer<typeof applyToJobSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
