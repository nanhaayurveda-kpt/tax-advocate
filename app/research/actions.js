"use server";

import { getSession } from "@/lib/auth";
import { findCaseLaw } from "@/lib/ai";

export async function researchAction(prevState, formData) {
  const session = await getSession();
  if (!session) {
    return {
      answer: "",
      sources: [],
      error: "Session expired. Please sign in again.",
    };
  }

  const query = formData.get("query")?.trim();
  const doctypes = formData.get("doctypes")?.trim() || undefined;

  if (!query) {
    return { answer: "", sources: [], error: "Please enter a search query." };
  }

  try {
    const { answer, sources } = await findCaseLaw(query, { doctypes });
    return { answer, sources, error: "" };
  } catch {
    return {
      answer: "",
      sources: [],
      error:
        "Search failed. Check the INDIAN_KANOON_TOKEN / GROQ_API_KEY and try again.",
    };
  }
}