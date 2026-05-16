"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Code2, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { cn } from "@/lib/cn";
import { PRIMARY_NAV, SITE_REPO } from "@/lib/site";
import { Button, buttonVariants } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname() ?? "/";
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="md:hidden p-2 -ml-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
              <Dialog.Content className="fixed z-50 left-0 top-0 bottom-0 w-[min(100%,320px)] border-r border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl outline-none">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-sm font-semibold">Navigation</Dialog.Title>
                  <Dialog.Close className="p-2 rounded-md hover:bg-[var(--color-surface-2)]">
                    <X size={18} />
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col gap-1">
                  {PRIMARY_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-3 py-2.5 rounded-lg text-sm transition-colors",
                        pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href))
                          ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <a
                    href={SITE_REPO}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]",
                    )}
                  >
                    GitHub
                  </a>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Link href="/" className="flex items-center gap-2.5 min-w-0 shrink-0">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold tabular border border-[var(--color-accent-soft)]"
              style={{
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
              }}
            >
              e8
            </span>
            <span className="font-semibold tracking-tight truncate">
              ekubo<span className="text-[var(--color-text-muted)]">bits</span>
            </span>
          </Link>
          <span className="hidden lg:inline text-xs text-[var(--color-text-dim)] truncate">
            Ekubo call-point inspector · Starknet
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-0.5 text-sm">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "px-2.5 py-1.5 rounded-md transition-colors",
                pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                  ? "text-[var(--color-text)] bg-[var(--color-surface-2)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          {mounted ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          ) : (
            <span className="w-10 h-10" aria-hidden />
          )}
          <a
            href={SITE_REPO}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            <Code2 size={18} />
            <span className="sr-only sm:not-sr-only sm:ml-1 sm:text-xs">Repo</span>
          </a>
        </div>
      </div>
    </header>
  );
}
