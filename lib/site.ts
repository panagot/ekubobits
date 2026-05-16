export const SITE_REPO =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/panagot/ekubobits";

export const PRIMARY_NAV = [
  { href: "/", label: "Inspector" },
  { href: "/extensions", label: "Extensions" },
  { href: "/register", label: "Register" },
  { href: "/api-docs", label: "API" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;
