'use client'

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <SignIn
      fallbackRedirectUrl="/trading-dashboard"
    />
  );
}