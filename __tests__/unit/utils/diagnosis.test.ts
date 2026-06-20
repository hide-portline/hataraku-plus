import { describe, it, expect } from "vitest";
import { calcScores, dominantType } from "@/lib/utils/diagnosis";
import type { DiagnosisAnswer } from "@/lib/utils/diagnosis";

const makeAnswer = (category: DiagnosisAnswer["category"], score: number): DiagnosisAnswer => ({
  questionId: "00000000-0000-0000-0000-000000000001",
  optionId:   "00000000-0000-0000-0000-000000000002",
  score,
  category,
});

describe("calcScores", () => {
  it("回答がない場合は全スコア0", () => {
    const result = calcScores([]);
    expect(result).toEqual({ challenger: 0, stable: 0, team: 0, specialist: 0 });
  });

  it("同じカテゴリの回答は合算される", () => {
    const answers = [
      makeAnswer("challenger", 2),
      makeAnswer("challenger", 1),
      makeAnswer("stable", -1),
    ];
    const result = calcScores(answers);
    expect(result.challenger).toBe(3);
    expect(result.stable).toBe(-1);
    expect(result.team).toBe(0);
    expect(result.specialist).toBe(0);
  });

  it("全カテゴリに回答がある場合、それぞれ合算される", () => {
    const answers = [
      makeAnswer("challenger", 3),
      makeAnswer("stable",     1),
      makeAnswer("team",       2),
      makeAnswer("specialist", -1),
    ];
    const result = calcScores(answers);
    expect(result).toEqual({ challenger: 3, stable: 1, team: 2, specialist: -1 });
  });
});

describe("dominantType", () => {
  it("最高スコアのカテゴリを返す", () => {
    expect(dominantType({ challenger: 10, stable: 5, team: 3, specialist: 1 })).toBe("challenger");
    expect(dominantType({ challenger: 1,  stable: 8, team: 3, specialist: 2 })).toBe("stable");
    expect(dominantType({ challenger: 0,  stable: 0, team: 7, specialist: 3 })).toBe("team");
    expect(dominantType({ challenger: 1,  stable: 2, team: 3, specialist: 9 })).toBe("specialist");
  });

  it("全スコアが0の場合も動作する（最初に出現したカテゴリを返す）", () => {
    const result = dominantType({ challenger: 0, stable: 0, team: 0, specialist: 0 });
    expect(["challenger", "stable", "team", "specialist"]).toContain(result);
  });

  it("マイナス値が含まれても最大値を正しく選ぶ", () => {
    expect(dominantType({ challenger: -1, stable: -2, team: -3, specialist: 0 })).toBe("specialist");
  });
});
