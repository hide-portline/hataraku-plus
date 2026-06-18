export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "応相談";
  if (min && max) return `${(min / 10000).toFixed(0)}〜${(max / 10000).toFixed(0)}万円`;
  if (min) return `${(min / 10000).toFixed(0)}万円〜`;
  return `〜${(max! / 10000).toFixed(0)}万円`;
}

export function formatEmploymentType(type: string): string {
  const map: Record<string, string> = {
    fulltime: "正社員",
    parttime: "パート・アルバイト",
    contract: "契約社員",
  };
  return map[type] ?? type;
}

export function formatWorkStyle(style?: string | null): string {
  const map: Record<string, string> = {
    remote: "リモート",
    onsite: "出社",
    hybrid: "ハイブリッド",
  };
  return style ? (map[style] ?? style) : "";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatApplicationStatus(status: string): string {
  const map: Record<string, string> = {
    applied:    "応募済み",
    screening:  "書類選考中",
    interview:  "面接中",
    offer:      "内定",
    hired:      "採用",
    rejected:   "不採用",
  };
  return map[status] ?? status;
}
