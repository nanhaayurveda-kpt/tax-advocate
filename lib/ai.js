import { searchKanoon } from "@/lib/kanoon";
import { DRAFT_TYPES } from "@/lib/draftTypes";

const MODEL = "llama-3.3-70b-versatile"; // change model only here
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// send prompt to Groq, return text response only (OpenAI-style chat completions)
async function askGroq(prompt) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_completion_tokens: 4096,
    }),
  });
  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

// search case law (Indian Kanoon) + Groq summarizes only those results (RAG)
export async function findCaseLaw(query, { doctypes } = {}) {
  // 1. retrieve real judgments
  const sources = await searchKanoon(query, { doctypes });

  if (sources.length === 0) {
    return { answer: "No judgments found on this topic.", sources: [] };
  }

  // 2. ask Groq to summarize only from these results — no fabrication
  const docsText = sources
    .map(
      (s, i) =>
        `[${i + 1}] Title: ${s.title}\nCourt: ${s.source}\nExcerpt: ${s.headline}\nLink: ${s.url}`
    )
    .join("\n\n");

  const prompt = `You are a legal research assistant. Below are excerpts from real judgments retrieved from Indian Kanoon. Based only on these documents, give a concise summary in English — what each judgment is about and how it could be useful.

Strict rules:
- Use only the documents given below. Do not invent any judgment, section, or citation from memory.
- If the documents do not answer the question, clearly state "Not found in the given documents".
- Tag each point with its [number] so the advocate can verify from the real link.

Question: ${query}

Documents:
${docsText}`;

  const answer = await askGroq(prompt);

  // 3. return both AI summary and real source links
  return { answer, sources };
}

// generate a legal draft — from type + facts (first draft, advocate must review)
export async function generateDraft(typeId, facts) {
  const type = DRAFT_TYPES.find((t) => t.id === typeId);
  if (!type) {
    return "Invalid draft type.";
  }

  const prompt = `You are a legal drafting assistant. Based on the facts given below, prepare a draft of "${type.label}" in the standard format used before Indian tax authorities/tribunals.

Structure:
- Heading with forum name and party details
- Main body
- Grounds — point-wise
- Prayer
- Date and signature line at the end

Strict rules:
- Where information is missing from the facts (name, case number, forum, date, etc.), leave a [____] placeholder for the advocate to fill in.
- Do not invent any fact, section, or case citation. If needed, write [Section/Decision — advocate to fill].
- Language should be formal English, suitable for filing before the forum.

Facts:
${facts}`;

  return askGroq(prompt);
}