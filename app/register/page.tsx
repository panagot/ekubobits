import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterClient } from "./register-client";

export const metadata: Metadata = {
  title: "Registration builder",
  description:
    "Toggle Ekubo call points and copy a Cairo set_call_points template for Starknet extensions.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-sm text-[var(--color-text-muted)]">
          Loading builder…
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
