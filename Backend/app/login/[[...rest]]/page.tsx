'use client'

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "rounded-lg shadow-md",
          },
        }}
        path="/login"
        routing="path"
        signUpUrl="/register"
        forceRedirectUrl="/trading-dashboard"
      />
    </div>
  );
}