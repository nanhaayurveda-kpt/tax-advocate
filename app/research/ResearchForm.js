"use client";

import { useActionState } from "react";
import { researchAction } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-800 focus:border-slate-500 focus:outline-none";

const initialState = { answer: "", sources: [], error: "" };

export default function ResearchForm() {
  const [state, formAction, isPending] = useActionState(
    researchAction,
    initialState,
  );

  return (
    <div className="px-4 pt-4">
      <form action={formAction} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            What are you researching?
          </label>
          <input
            name="query"
            type="text"
            required
            placeholder="e.g. unexplained cash credit section 68 burden of proof"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Scope</label>
          <select
            name="doctypes"
            defaultValue="itat,supremecourt"
            className={inputClass}
          >
            <option value="itat,supremecourt">
              ITAT + Supreme Court (recommended)
            </option>
            <option value="itat">ITAT only</option>
            <option value="supremecourt">Supreme Court only</option>
            <option value="">All India (incl. High Courts)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-base font-medium text-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "Searching…" : "Search Case Law"}
        </button>
      </form>

      {state.error && (
        <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state.answer && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Summary</h2>
          <pre className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800">
            {state.answer}
          </pre>
        </section>
      )}

      {state.sources?.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            Sources (verify on Indian Kanoon)
          </h2>
          <ul className="space-y-3">
            {state.sources.map((s, i) => (
              <li
                key={s.tid || i}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-slate-800 underline"
                >
                  [{i + 1}] {s.title}
                </a>
                {s.source && (
                  <p className="mt-0.5 text-xs text-slate-500">{s.source}</p>
                )}
                {s.headline && (
                  <p className="mt-1 text-sm text-slate-600">{s.headline}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
