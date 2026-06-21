"use server";

import { getSession } from "@/lib/auth";
import { generateDraft } from "@/lib/ai";

export async function generateDraftAction(prevState, formData) {
  const session = await getSession();
  if (!session) {
    return { draft: "", error: "Session expired. Please sign in again." };
  }

  const typeId = formData.get("typeId");
  const facts = formData.get("facts")?.trim();

  if (!typeId) return { draft: "", error: "Please choose a draft type." };
  if (!facts) return { draft: "", error: "Please enter the facts." };

  try {
    const draft = await generateDraft(typeId, facts);
    return { draft, error: "" };
  } catch {
    return {
      draft: "",
      error: "Draft generation failed. Check GROQ_API_KEY and try again.",
    };
  }
}