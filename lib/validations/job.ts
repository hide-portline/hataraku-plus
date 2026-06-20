import { z } from "zod";

const employmentTypeEnum = z.enum(["fulltime", "parttime", "contract"]);
const workStyleEnum = z.enum(["onsite", "remote", "hybrid"]);
const valuesTypeEnum = z.enum(["challenger", "stable", "team", "specialist"]);

export const createJobSchema = z.object({
  title: z.string().min(1, "求人タイトルを入力してください").max(200),
  employment_type: employmentTypeEnum,
  salary_min: z
    .string()
    .optional()
    .transform((v) => (v && v !== "" ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0), "給与は0以上の整数で入力してください"),
  salary_max: z
    .string()
    .optional()
    .transform((v) => (v && v !== "" ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0), "給与は0以上の整数で入力してください"),
  location: z.string().max(200).optional().transform((v) => v || null),
  description: z.string().max(5000).optional().transform((v) => v || null),
  required_skills: z.string().max(3000).optional().transform((v) => v || null),
  benefits: z.string().max(3000).optional().transform((v) => v || null),
  work_style: workStyleEnum.optional().or(z.literal("")).transform((v) => v || null),
  values_type: valuesTypeEnum.optional().or(z.literal("")).transform((v) => v || null),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
