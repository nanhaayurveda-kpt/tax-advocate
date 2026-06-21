import { redirect } from "next/navigation";
import { and, eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cases, clients } from "@/lib/schema";
import { todayIST } from "@/lib/dates";
import CasesList from "./CasesList";

export default async function CasesPage({ searchParams }) {
  // auth — redirect to login if no session
  const session = await getSession();
  if (!session) redirect("/");

  const sp = await searchParams;
  const showDisposed = sp?.show === "disposed";

  // all active cases for the office, with client, ordered by next hearing
  const rows = await db
    .select({
      id: cases.id,
      caseNumber: cases.caseNumber,
      courtName: cases.courtName,
      stage: cases.stage,
      nextHearingDate: cases.nextHearingDate,
      clientName: clients.name,
    })
    .from(cases)
    .leftJoin(clients, eq(cases.clientId, clients.id))
    .where(
      and(
        eq(cases.userId, session.id),
        eq(cases.status, showDisposed ? "disposed" : "active"),
      ),
    )
    .orderBy(asc(cases.nextHearingDate));

  const today = todayIST();

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      {/* header — back + new case */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <a
          href="/dashboard"
          className="text-sm text-slate-500 active:text-slate-800"
        >
          ← Back
        </a>
        <p className="text-base font-bold text-slate-800">All Cases</p>
        <a href="/cases/new" className="text-sm font-medium text-slate-800">
          + New
        </a>
      </header>
      {/* active / disposed tabs */}
      <div className="flex gap-2 px-4 pt-3">
        <a
          href="/cases"
          className={
            "rounded-lg px-3 py-1.5 text-sm font-medium " +
            (!showDisposed
              ? "bg-slate-800 text-white"
              : "border border-slate-200 bg-white text-slate-600")
          }
        >
          Active
        </a>
        <a
          href="/cases?show=disposed"
          className={
            "rounded-lg px-3 py-1.5 text-sm font-medium " +
            (showDisposed
              ? "bg-slate-800 text-white"
              : "border border-slate-200 bg-white text-slate-600")
          }
        >
          Disposed
        </a>
      </div>

      <section className="px-4 pt-4">
        {rows.length === 0 ? (
          <p className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            {showDisposed
              ? "No disposed cases."
              : 'No cases yet. Add one with "+ New" above.'}
          </p>
        ) : (
          <CasesList cases={rows} today={today} />
        )}
      </section>
    </main>
  );
}