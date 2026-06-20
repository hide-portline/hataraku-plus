"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLoginAction, undefined);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Administrator
          </p>
          <h1 className="text-2xl font-bold text-white">管理者ログイン</h1>
          <p className="text-sm text-gray-500 mt-1">Hataraku+</p>
        </div>

        <form action={action} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex flex-col gap-4">
          {state?.error && (
            <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-400 tracking-wide">
              メールアドレス
            </label>
            <input
              id="email" name="email" type="email" required
              placeholder="admin@example.com"
              className="w-full border border-gray-700 rounded-xl px-4 py-3 text-sm bg-gray-800 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-gray-400 tracking-wide">
              パスワード
            </label>
            <input
              id="password" name="password" type="password" required
              placeholder="••••••••"
              className="w-full border border-gray-700 rounded-xl px-4 py-3 text-sm bg-gray-800 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 rounded-xl bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 mt-2"
          >
            {pending ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
