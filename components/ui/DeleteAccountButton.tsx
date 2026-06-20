"use client";

import { deleteAccountAction } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";

export default function DeleteAccountButton() {
  async function handleDelete() {
    if (!confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) return;
    await deleteAccountAction();
  }

  return (
    <Button
      type="button"
      onClick={handleDelete}
      variant="outline"
      size="sm"
      className="text-red-500 border-red-200 hover:bg-red-50"
    >
      アカウントを削除する
    </Button>
  );
}
