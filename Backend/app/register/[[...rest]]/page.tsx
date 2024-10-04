'use client'

import { SignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "rounded-lg shadow-md",
          },
        }}
        path="/register"
        routing="path"
        signInUrl="/login"
        afterSignUpUrl="/trading-dashboard"
        redirectUrl="/trading-dashboard"
      />
    </div>
  );
}