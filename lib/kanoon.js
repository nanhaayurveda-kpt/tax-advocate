const BASE = "https://api.indiankanoon.org";

// request to Indian Kanoon API — POST + Token auth, response in JSON
async function ikRequest(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.INDIAN_KANOON_TOKEN}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Indian Kanoon API error: ${res.status}`);
  }
  return res.json();
}

// search case law — formInput query, pagenum from 0, doctypes optional filter
export async function searchKanoon(query, { pagenum = 0, doctypes } = {}) {
  const params = new URLSearchParams({
    formInput: query,
    pagenum: String(pagenum),
  });
  if (doctypes) params.set("doctypes", doctypes);

  const data = await ikRequest(`/search/?${params.toString()}`);

  // return only the fields we need
  return (data.docs || []).map((d) => ({
    tid: d.tid,            // document id
    title: d.title,
    headline: d.headline,  // snippet
    source: d.docsource,   // court/forum
    url: `https://indiankanoon.org/doc/${d.tid}/`, // real source link
  }));
}

// fetch full judgment — by docid
export async function getDocument(docid) {
  const data = await ikRequest(`/doc/${docid}/`);
  return {
    tid: docid,
    title: data.title,
    text: data.doc,        // full judgment text
    url: `https://indiankanoon.org/doc/${docid}/`, // advocate verifies directly
  };
}