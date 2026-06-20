import { z } from "zod";

const employmentTypePrefEnum = z.enum(["fulltime", "parttime", "contract"]);

export const seekerProfileSchema = z.object({
  name: z.string().min(1, "氏名を入力してください").max(100),
  phone: z
    .string()
    .max(20)
    .optional()
    .transform((v) => v || null)
    .refine(
      (v) => v === null || /^[\d\-\+\(\)\s]+$/.test(v),
      "電話番号の形式が正しくありません"
    ),
  bio: z.string().max(2000).optional().transform((v) => v || null),
  desired_location: z.string().max(200).optional().transform((v) => v || null),
  employment_type_pref: employmentTypePrefEnum
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
});

export const companyProfileSchema = z.object({
  company_name: z.string().min(1, "企業名を入力してください").max(200),
  industry: z.string().max(100).optional().transform((v) => v || null),
  description: z.string().max(5000).optional().transform((v) => v || null),
  vision: z.string().max(2000).optional().transform((v) => v || null),
  culture_description: z.string().max(3000).optional().transform((v) => v || null),
  location: z.string().max(200).optional().transform((v) => v || null),
  website_url: z
    .string()
    .max(500)
    .optional()
    .transform((v) => v || null)
    .refine(
      (v) => v === null || /^https?:\/\//.test(v),
      "URLはhttps://から始めてください"
    ),
  employee_count: z
    .string()
    .optional()
    .transform((v) => (v && v !== "" ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v > 0), "従業員数は1以上の整数を入力してください"),
  founded_year: z
    .string()
    .optional()
    .transform((v) => (v && v !== "" ? Number(v) : null))
    .refine(
      (v) => v === null || (Number.isInteger(v) && v >= 1800 && v <= new Date().getFullYear()),
      "設立年が正しくありません"
    ),
});

export type SeekerProfileInput = z.infer<typeof seekerProfileSchema>;
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
