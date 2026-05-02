"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { VerifyCard } from "@/components/auth/verify/verify-card";

export default function VerifyRoute() {
  const email = useSearchParams().get("email") ?? "";
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <VerifyCard email={email} onBack={() => router.push("/auth/signin")} />
    </div>
  );
}
