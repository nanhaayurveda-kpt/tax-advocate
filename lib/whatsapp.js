// wa.me link to send to client (message text)
export function waReminderLink(phone, caseNumber, dateText, court) {
  const digits = (phone || "").replace(/\D/g, "");
  const num = digits.startsWith("91") ? digits : `91${digits}`;
  const officeName = process.env.NEXT_PUBLIC_CHOWKI_NAME || "";
  const msg = `Hello, your case ${caseNumber} has its next hearing on ${dateText} at ${court || "the forum"}. — ${officeName}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}