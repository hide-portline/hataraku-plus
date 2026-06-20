"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 mb-4">
            System Error
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            予期しないエラーが発生しました
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            問題が継続する場合はお問い合わせください。
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            再試行する
          </button>
        </div>
      </body>
    </html>
  );
}
