import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createCase } from "./actions";
import { CASE_TYPES } from "@/lib/caseTypes";
import { COURTS } from "@/lib/courts";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-800 focus:border-slate-500 focus:outline-none";

export default async function NewCasePage({ searchParams }) {
  // auth
  const session = await getSession();
  if (!session) redirect("/");

  const params = await searchParams;
  const showError = params?.error === "missing";

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      {/* header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <a
          href="/cases"
          className="text-sm text-slate-500 active:text-slate-800"
        >
          ← Back
        </a>
        <p className="text-base font-bold text-slate-800">New Case</p>
        <span className="w-10" />
      </header>

      {showError && (
        <p className="mx-4 mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          Client name and case number are required.
        </p>
      )}

      <form action={createCase} className="space-y-4 px-4 pt-4">
        {/* client */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Client Name *
          </label>
          <input
            name="clientName"
            type="text"
            required
            placeholder="Enter name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Client Phone
          </label>
          <input
            name="clientPhone"
            type="tel"
            inputMode="numeric"
            placeholder="WhatsApp number"
            className={inputClass}
          />
        </div>

        {/* case */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Case Number *
          </label>
          <input
            name="caseNumber"
            type="text"
            required
            placeholder="Enter case number"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Forum</label>
          <input
            name="courtName"
            type="text"
            list="courtList"
            placeholder="Select or type (include room number too)"
            className={inputClass}
          />
          <datalist id="courtList">
            {COURTS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Case Type
          </label>
          <select name="caseType" defaultValue="" className={inputClass}>
            <option value="">Select (optional)</option>
            {CASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Opposite Party</label>
          <input
            name="oppositeParty"
            type="text"
            placeholder="Opposite party"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Next Hearing
          </label>
          <input name="nextHearingDate" type="date" className={inputClass} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Stage (what it's for)
          </label>
          <input
            name="stage"
            type="text"
            placeholder="e.g. — Arguments, Evidence"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Notes</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Any notes"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-800 px-4 py-3.5 text-base font-medium text-white transition active:scale-[0.98]"
        >
          Save
        </button>
      </form>
    </main>
  );
}