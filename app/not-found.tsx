import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-[var(--color-text-muted)] mt-2 max-w-md">
        This route does not exist. Try the inspector or extensions registry.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm text-[var(--color-accent)] hover:underline"
      >
        ← Back home
      </Link>
    </div>
  );
}
