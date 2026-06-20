import * as Sentry from "@sentry/nextjs";

/**
 * エラーをSentryに送信し、必ずコンソールにも記録する。
 * SENTRY_DSNが未設定でも安全に動作する。
 */
export function captureError(error: unknown, context?: Record<string, string>) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error("[captureError]", err.message, context ?? "");

  if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(err, context ? { extra: context } : undefined);
  }
}

/**
 * 非クリティカルな処理のエラーをログ記録する（Promiseのcatchに使う）。
 */
export function logError(label: string) {
  return (error: unknown) => {
    captureError(error, { label });
  };
}
