"use client";

export default function Error({ reset }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-lg font-semibold text-slate-800">
        Something went wrong
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Please try again. If it keeps happening, go back to the dashboard.
      </p>
      <div className="mt-5 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white active:scale-[0.98]"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 active:scale-[0.98]"
        >
          Dashboard
        </a>
      </div>
    </main>
  );
}