import { describe, it, expect } from "vitest";
import {
  formatSalary,
  formatEmploymentType,
  formatWorkStyle,
  formatApplicationStatus,
  formatDate,
} from "@/lib/utils/format";

describe("formatSalary", () => {
  it("min・maxどちらもない場合は「応相談」", () => {
    expect(formatSalary()).toBe("応相談");
    expect(formatSalary(null, null)).toBe("応相談");
    expect(formatSalary(0, 0)).toBe("応相談");
  });

  it("min・maxどちらもある場合は範囲表示", () => {
    expect(formatSalary(200000, 300000)).toBe("20〜30万円");
    expect(formatSalary(250000, 400000)).toBe("25〜40万円");
  });

  it("minのみの場合は「XX万円〜」", () => {
    expect(formatSalary(200000)).toBe("20万円〜");
  });

  it("maxのみの場合は「〜XX万円」", () => {
    expect(formatSalary(null, 300000)).toBe("〜30万円");
  });

  it("1万円未満は丸めて表示される（0万円〜 または 1万円〜）", () => {
    const result = formatSalary(5000);
    expect(result).toMatch(/万円〜$/);
  });
});

describe("formatEmploymentType", () => {
  it("fulltime → 正社員", () => {
    expect(formatEmploymentType("fulltime")).toBe("正社員");
  });

  it("parttime → パート・アルバイト", () => {
    expect(formatEmploymentType("parttime")).toBe("パート・アルバイト");
  });

  it("contract → 契約社員", () => {
    expect(formatEmploymentType("contract")).toBe("契約社員");
  });

  it("未知の値はそのまま返す", () => {
    expect(formatEmploymentType("unknown")).toBe("unknown");
  });
});

describe("formatWorkStyle", () => {
  it("remote → リモート", () => {
    expect(formatWorkStyle("remote")).toBe("リモート");
  });

  it("onsite → 出社", () => {
    expect(formatWorkStyle("onsite")).toBe("出社");
  });

  it("hybrid → ハイブリッド", () => {
    expect(formatWorkStyle("hybrid")).toBe("ハイブリッド");
  });

  it("null/undefinedは空文字", () => {
    expect(formatWorkStyle(null)).toBe("");
    expect(formatWorkStyle(undefined)).toBe("");
  });
});

describe("formatApplicationStatus", () => {
  const cases: [string, string][] = [
    ["applied",   "応募済み"],
    ["screening", "書類選考中"],
    ["interview", "面接中"],
    ["offer",     "内定"],
    ["hired",     "採用"],
    ["rejected",  "不採用"],
  ];

  it.each(cases)("%s → %s", (input, expected) => {
    expect(formatApplicationStatus(input)).toBe(expected);
  });

  it("未知のステータスはそのまま返す", () => {
    expect(formatApplicationStatus("unknown")).toBe("unknown");
  });
});

describe("formatDate", () => {
  it("ISO文字列を日本語日付にフォーマット", () => {
    const result = formatDate("2026-06-21T00:00:00.000Z");
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/6月/);
  });
});
