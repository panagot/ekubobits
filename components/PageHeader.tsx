import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Crumb = { href: string; label: string };

export function PageHeader({
  title,
  description,
  breadcrumbs,
  className,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  className?: string;
}) {
  return (
    <header className={cn("mb-8 max-w-3xl", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav className="flex flex-wrap items-center gap-1 text-xs text-[var(--color-text-dim)] mb-3">
          {breadcrumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight size={12} className="opacity-60" /> : null}
              <Link href={c.href} className="hover:text-[var(--color-accent)]">
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-3 text-[var(--color-text-muted)] leading-relaxed">{description}</p>
      ) : null}
    </header>
  );
}
