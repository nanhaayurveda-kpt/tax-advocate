"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients, cases } from "@/lib/schema";

export async function createCase(formData) {
  // auth — session required
  const session = await getSession();
  if (!session) redirect("/");

  // pull values from form
  const clientName = formData.get("clientName")?.trim();
  const clientPhone = formData.get("clientPhone")?.trim() || null;
  const caseNumber = formData.get("caseNumber")?.trim();
  const courtName = formData.get("courtName")?.trim() || null;
  const caseType = formData.get("caseType") || null;
  const oppositeParty = formData.get("oppositeParty")?.trim() || null;
  const nextHearingDate = formData.get("nextHearingDate") || null;
  const stage = formData.get("stage")?.trim() || null;
  const notes = formData.get("notes")?.trim() || null;

  // required — client name and case number
  if (!clientName || !caseNumber) {
    redirect("/cases/new?error=missing");
  }

  // resolve client id — reuse existing client with same phone if found (avoid duplicates)
  let clientId;
  if (clientPhone) {
    const existing = (
      await db
        .select({ id: clients.id })
        .from(clients)
        .where(
          and(eq(clients.userId, session.id), eq(clients.phone, clientPhone)),
        )
        .limit(1)
    )[0];
    if (existing) clientId = existing.id;
  }

  // not found (or phone empty) — create a new client (no .returning() on Turso)
  if (!clientId) {
    await db.insert(clients).values({
      userId: session.id,
      name: clientName,
      phone: clientPhone,
    });
    const created = (
      await db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.userId, session.id))
        .orderBy(desc(clients.id))
        .limit(1)
    )[0];
    clientId = created.id;
  }

  // then add the case, linked to that client
  await db.insert(cases).values({
    userId: session.id,
    clientId,
    caseNumber,
    courtName,
    caseType,
    oppositeParty,
    nextHearingDate,
    stage,
    notes,
    status: "active",
  });

  // revalidate lists, then redirect to cases list
  revalidatePath("/cases");
  revalidatePath("/dashboard");
  redirect("/cases");
}