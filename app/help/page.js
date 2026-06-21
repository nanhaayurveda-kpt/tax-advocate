export default function HelpPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-10">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <a
          href="/dashboard"
          className="text-sm text-slate-500 active:text-slate-800"
        >
          ← Back
        </a>
        <p className="text-base font-bold text-slate-800">Help</p>
        <span className="w-10" />
      </header>

      <div className="space-y-5 px-4 pt-5 text-sm leading-relaxed text-slate-700">
        <div>
          <h2 className="font-semibold text-slate-800">Add a case</h2>
          <p className="mt-1">
            Dashboard → “Add New Case”. Enter the client name and case number
            (required), the forum, type, and the next hearing date.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">Today &amp; overdue</h2>
          <p className="mt-1">
            The dashboard shows today’s hearings and any overdue ones in red —
            open an overdue case to set its new date.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">Send a reminder</h2>
          <p className="mt-1">
            If a client has a phone number, a “Send Reminder” button appears on
            today’s hearings — it opens WhatsApp with a ready message.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">AI Draft Generator</h2>
          <p className="mt-1">
            Pick a draft type (Notice Reply, Appeal, application…), enter the
            facts, and get a first draft. Always review and fill the [____]
            blanks before filing.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">Case Law Search</h2>
          <p className="mt-1">
            Search real judgments from Indian Kanoon with an AI summary. Always
            open the source links to verify before citing.
          </p>
        </div>
      </div>
    </main>
  );
}