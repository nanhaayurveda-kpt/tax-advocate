"use client";

import { useTransition } from "react";
import { deleteCaseAction } from "./actions";

export default function DeleteCase({ caseId }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
      startTransition(async () => {
        await deleteCaseAction(caseId);
      });
    }
  };

  return (
    <div className="mt-8 pt-4 border-t border-slate-200">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-base font-medium text-red-600 transition active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete Case"}
      </button>
    </div>
  );
}