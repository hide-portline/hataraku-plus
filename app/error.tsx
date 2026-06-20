"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#ABABAB] mb-4">
        Error
      </p>
      <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-3">
        エラーが発生しました
      </h1>
      <p className="text-sm text-[#6B6B6B] mb-8">
        問題が継続する場合はトップページからやり直してください。
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#E8792A] transition-colors"
        >
          再試行する
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-[#E4E4E0] text-sm font-semibold text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
        >
          トップへ
        </Link>
      </div>
    </div>
  );
}
