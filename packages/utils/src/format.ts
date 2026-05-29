/** 통화 포맷. 기본 KRW. */
export function formatCurrency(
  amount: number,
  options: { currency?: string; locale?: string } = {},
): string {
  const { currency = "KRW", locale = "ko-KR" } = options;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

/** 천단위 구분 숫자. */
export function formatNumber(value: number, locale = "ko-KR"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** 날짜 포맷. Date | string | number 허용. */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
  locale = "ko-KR",
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/** 상대 시간 ("3분 전"). */
export function formatRelativeTime(date: Date | string | number, locale = "ko-KR"): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diffMs = new Date(date).getTime() - Date.now();
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms || unit === "second") {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return rtf.format(0, "second");
}

/** 긴 문자열 말줄임. */
export function truncate(text: string, max = 80): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

/** "user@x.com" -> "u***@x.com" 같은 마스킹. */
export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain || !name) return email;
  const visible = name.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(name.length - 1, 1))}@${domain}`;
}
