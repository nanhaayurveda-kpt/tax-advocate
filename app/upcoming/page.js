import { redirect } from "next/navigation";
import { and, eq, gte, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cases, clients } from "@/lib/schema";
import { todayIST, formatDate } from "@/lib/dates";

export default async function UpcomingPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const today = todayIST();

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
        eq(cases.status, "active"),
        gte(cases.nextHearingDate, today),
      ),
    )
    .orderBy(asc(cases.nextHearingDate));

  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <a
          href="/dashboard"
          className="text-sm text-slate-500 active:text-slate-800"
        >
          ← Back
        </a>
        <p className="text-base font-bold text-slate-800">Upcoming Hearings</p>
        <span className="w-10" />
      </header>

      <section className="px-4 pt-4">
        {rows.length === 0 ? (
          <p className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No upcoming hearings.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map((c) => (
              <li key={c.id}>
                <a
                  href={`/cases/${c.id}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 transition active:scale-[0.99]"
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
                        <p className="mt-0.5 text-sm text-slate-500">
                          {c.stage}
                        </p>
                      )}
                    </div>
                    <span
                      className={
                        "shrink-0 rounded-lg px-2 py-1 text-xs font-medium " +
                        (c.nextHearingDate === today
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600")
                      }
                    >
                      {formatDate(c.nextHearingDate)}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}