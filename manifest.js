export default function manifest() {
  const officeName = process.env.NEXT_PUBLIC_CHOWKI_NAME || "Hearing Management";
  return {
    name: `${officeName} — Hearing Management`,
    short_name: officeName,
    description: "Hearing and client management",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#1e293b",
    lang: "en",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}