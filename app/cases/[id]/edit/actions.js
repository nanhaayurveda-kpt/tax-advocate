"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cases, clients } from "@/lib/schema";

export async function updateCase(formData) {
  const session = await getSession();
  if (!session) redirect("/");

  const caseIdStr = formData.get("caseId");
  const caseId = parseInt(caseIdStr, 10);
  if (!caseId) redirect("/cases");

  // फॉर्म से डेटा निकालना
  const clientName = formData.get("clientName")?.toString().trim();
  const clientPhone = formData.get("clientPhone")?.toString().trim();
  const caseNumber = formData.get("caseNumber")?.toString().trim();
  const courtName = formData.get("courtName")?.toString().trim();
  const caseType = formData.get("caseType")?.toString().trim();
  const oppositeParty = formData.get("oppositeParty")?.toString().trim();
  const nextHearingDate = formData.get("nextHearingDate")?.toString().trim();
  const stage = formData.get("stage")?.toString().trim();
  const status = formData.get("status")?.toString().trim() || "active";
  const notes = formData.get("notes")?.toString().trim();

  // वैलिडेशन (Required fields)
  if (!clientName || !caseNumber) {
    redirect(`/cases/${caseId}/edit?error=missing`);
  }

  // 1. पहले चेक करें कि यह केस यूजर का है या नहीं और उसकी clientId निकालें
  const currentCase = (
    await db
      .select({ clientId: cases.clientId })
      .from(cases)
      .where(and(eq(cases.id, caseId), eq(cases.userId, session.id)))
      .limit(1)
  )[0];

  if (!currentCase) {
    redirect("/cases");
  }

  // 2. क्लाइंट का नाम और फोन अपडेट करें
  if (currentCase.clientId) {
    await db
      .update(clients)
      .set({
        name: clientName,
        phone: clientPhone,
      })
      .where(eq(clients.id, currentCase.clientId));
  }

  // 3. केस की डिटेल्स अपडेट करें
  await db
    .update(cases)
    .set({
      caseNumber,
      courtName,
      caseType,
      oppositeParty,
      nextHearingDate: nextHearingDate || null,
      stage,
      status,
      notes,
    })
    .where(eq(cases.id, caseId));

  // पुराना कैश क्लियर करें और केस व्यू पेज पर वापस भेजें
  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/cases");
  redirect(`/cases/${caseId}`);
}

export async function deleteCaseAction(caseId) {
  const session = await getSession();
  if (!session) redirect("/");

  if (!caseId) redirect("/cases");

  // सिर्फ वही यूजर डिलीट कर पाए जिसने केस बनाया है
  await db
    .delete(cases)
    .where(and(eq(cases.id, caseId), eq(cases.userId, session.id)));

  revalidatePath("/cases");
  redirect("/cases");
}