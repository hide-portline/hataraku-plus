import { z } from "zod";

const valuesTypeEnum = z.enum(["challenger", "stable", "team", "specialist"]);

export const diagnosisAnswerSchema = z.object({
  questionId: z.string().uuid("無効な質問IDです"),
  optionId: z.string().uuid("無効な選択肢IDです"),
  score: z.number().int().min(-3).max(3),
  category: valuesTypeEnum,
});

export const submitDiagnosisSchema = z.object({
  answers: z
    .array(diagnosisAnswerSchema)
    .min(1, "回答が必要です")
    .max(50, "回答数が多すぎます"),
});

export const submitCompanyDiagnosisSchema = z.object({
  companyId: z.string().uuid("無効な企業IDです"),
  answers: z
    .array(diagnosisAnswerSchema)
    .min(1, "回答が必要です")
    .max(50, "回答数が多すぎます"),
});

export type DiagnosisAnswerInput = z.infer<typeof diagnosisAnswerSchema>;
export type SubmitDiagnosisInput = z.infer<typeof submitDiagnosisSchema>;
