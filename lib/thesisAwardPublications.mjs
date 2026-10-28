import { normalizeMatchText, thesisPublicationTopicEvidence } from "./thesisPublicationMatcher.mjs";

function publicationKeys(title, year, doi) {
  const keys = [`title:${normalizeMatchText(title)}:${Number(year) || 0}`];
  if (String(doi || "").trim()) keys.unshift(`doi:${String(doi).trim().toLowerCase()}`);
  return keys;
}

export function createThesisAwardPublicationFilter({ scopus = [], trDizin = [] } = {}) {
  // Award rows omit keywords and abstracts; use the saved source metadata to
  // recheck existing verified rows without rewriting their stored decisions.
  const sourceByKey = new Map();
  const sources = [...scopus, ...(Array.isArray(trDizin) ? trDizin : trDizin?.papers || [])];
  for (const publication of sources) {
    for (const key of publicationKeys(publication.title, publication.year, publication.doi)) {
      const bucket = sourceByKey.get(key) || [];
      bucket.push(publication);
      sourceByKey.set(key, bucket);
    }
  }
  return (row, thesis) => {
    if (row.relation_status === "advisor_confirmed") return true;
    if (row.relation_status !== "verified") return false;
    const keys = publicationKeys(row.publication_title, row.publication_year, row.doi);
    const publications = [...new Set(keys.flatMap((key) => sourceByKey.get(key) || []))];
    if (!publications.length) publications.push({ title: row.publication_title });
    return publications.some((publication) => {
      const { bestTitle, topic } = thesisPublicationTopicEvidence(thesis, publication);
      return (bestTitle.shared.length >= 2 && bestTitle.coverage >= 0.23)
        || (topic.shared.length >= 3 && topic.coverage >= 0.23);
    });
  };
}
