import { z } from "zod";

const valuesTypeEnum = z.enum(["challenger", "stable", "team", "specialist"]);

// Zod v4 の z.string().uuid() は RFC 4122 バージョンビットを厳格検証するため
// シードデータの d0000001-0000-0000-0000-000000000000 形式を拒否する。
// PostgreSQL uuid 型と同等の 8-4-4-4-12 16進数パターンで検証する。
const uuidLike = (msg: string) =>
  z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, msg);

export const diagnosisAnswerSchema = z.object({
  questionId: uuidLike("無効な質問IDです"),
  optionId: uuidLike("無効な選択肢IDです"),
  score: z.number().int().min(1).max(4),
  category: valuesTypeEnum,
});

export const submitDiagnosisSchema = z.object({
  answers: z
    .array(diagnosisAnswerSchema)
    .min(1, "回答が必要です")
    .max(50, "回答数が多すぎます"),
});

export const submitCompanyDiagnosisSchema = z.object({
  companyId: uuidLike("無効な企業IDです"),
  answers: z
    .array(diagnosisAnswerSchema)
    .min(1, "回答が必要です")
    .max(50, "回答数が多すぎます"),
});

export type DiagnosisAnswerInput = z.infer<typeof diagnosisAnswerSchema>;
export type SubmitDiagnosisInput = z.infer<typeof submitDiagnosisSchema>;
