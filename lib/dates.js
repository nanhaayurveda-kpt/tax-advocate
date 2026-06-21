// Shared date helpers — used throughout the app

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Today's date per IST — YYYY-MM-DD
export function todayIST() {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

// YYYY-MM-DD → "15 June 2026"
export function formatDate(ymd) {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}