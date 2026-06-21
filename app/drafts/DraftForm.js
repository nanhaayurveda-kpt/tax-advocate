"use client";

import { useActionState } from "react";
import { generateDraftAction } from "./actions";
import { DRAFT_TYPES } from "@/lib/draftTypes";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-800 focus:border-slate-500 focus:outline-none";

const initialState = { draft: "", error: "" };

export default function DraftForm() {
  const [state, formAction, isPending] = useActionState(
    generateDraftAction,
    initialState,
  );

  function copyDraft() {
    if (state.draft) navigator.clipboard.writeText(state.draft);
  }

  return (
    <div className="px-4 pt-4">
      <form action={formAction} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Draft type
          </label>
          <select name="typeId" defaultValue="notice_reply" className={inputClass}>
            {DRAFT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Facts</label>
          <textarea
            name="facts"
            rows={6}
            required
            placeholder="Enter the case facts — names, notice/section, dates, amount, relief sought…"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-base font-medium text-white active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "Generating…" : "Generate Draft"}
        </button>
      </form>

      {state.error && (
        <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state.draft && (
        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Draft</h2>
            <button
              type="button"
              onClick={copyDraft}
              className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 active:scale-95"
            >
              Copy
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800">
{state.draft}
          </pre>
        </section>
      )}
    </div>
  );
}