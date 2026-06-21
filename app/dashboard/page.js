import { redirect } from "next/navigation";
import { and, eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cases, clients } from "@/lib/schema";
import { todayIST, formatDate } from "@/lib/dates";

function CaseRow({ c, tone }) {
  const toneCls =
    tone === "red"
      ? "bg-red-100 text-red-700"
      : tone === "green"
      ? "bg-green-100 text-green-700"
      : "bg-slate-100 text-slate-600";

  return (
    
      href={`/cases/${c.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-800">
            {c.clientName}
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            Case {c.caseNumber}
            {c.courtName ? ` • ${c.courtName}` : ""}
          </p>
          {c.stage && (
            <p className="mt-0.5 text-sm text-slate-500">{c.stage}</p>
          )}
        </div>
        {c.nextHearingDate && (
          <span
            className={
              "shrink-0 rounded-lg px-2 py-1 text-xs font-medium " + toneCls
            }
          >
            {formatDate(c.nextHearingDate)}
          </span>
        )}
      </div>
    </a>
  );
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");

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
    .where(and(eq(cases.userId, session.id), eq(cases.status, "active")))
    .orderBy(asc(cases.nextHearingDate));

  const today = todayIST();
  const overdue = rows.filter(
    (c) => c.nextHearingDate && c.nextHearingDate < today,
  );
  const dueToday = rows.filter((c) => c.nextHearingDate === today);
  const upcoming = rows
    .filter((c) => c.nextHearingDate && c.nextHearingDate > today)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <p className="text-base font-bold text-slate-800">Tax Advocate</p>
        <a
          href="/api/auth/logout"
          className="text-sm text-slate-500 active:text-slate-800"
        >
          Logout
        </a>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-800">{rows.length}</p>
          <p className="text-sm text-slate-500">Active cases</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-red-600">{overdue.length}</p>
          <p className="text-sm text-slate-500">Overdue dates</p>
        </div>
      </div>

      {overdue.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="mb-2 text-sm font-semibold text-red-700">
            Overdue ({overdue.length})
          </h2>
          <div className="space-y-3">
            {overdue.map((c) => (
              <CaseRow key={c.id} c={c} tone="red" />
            ))}
          </div>
        </section>
      )}

      {dueToday.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="mb-2 text-sm font-semibold text-green-700">
            Today ({dueToday.length})
          </h2>
          <div className="space-y-3">
            {dueToday.map((c) => (
              <CaseRow key={c.id} c={c} tone="green" />
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pt-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No upcoming dates.
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((c) => (
              <CaseRow key={c.id} c={c} tone="slate" />
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-3 px-4 pt-6">
        <a
          href="/cases"
          className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-center text-sm font-medium text-slate-800 active:scale-[0.99]"
        >
          All Cases
        </a>
        <a
          href="/cases/new"
          className="flex-1 rounded-xl bg-slate-800 py-3 text-center text-sm font-medium text-white active:scale-[0.99]"
        >
          + New Case
        </a>
      </div>
    </main>
  );
}