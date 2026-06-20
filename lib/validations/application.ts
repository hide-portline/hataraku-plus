import { z } from "zod";

// Zod v4 の z.string().uuid() は RFC 4122 バージョンビット必須のため PostgreSQL UUID と互換性なし
const uuidSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "無効なIDです");

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
