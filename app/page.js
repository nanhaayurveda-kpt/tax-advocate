import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-slate-800">Tax Advocate</h1>
        <p className="mt-2 text-sm text-slate-500">
          Case &amp; hearing manager for your tax practice
        </p>

        <a
          href="/api/auth/login"
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-800 px-5 py-3 text-base font-medium text-white active:scale-[0.99]"
        >
          Sign in with Google
        </a>
      </div>
    </main>
  );
}