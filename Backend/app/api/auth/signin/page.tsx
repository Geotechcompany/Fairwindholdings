'use client'

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "rounded-lg shadow-md",
          },
        }}
        path="/api/auth/signin"
        fallbackRedirectUrl="/"
        routing="path"
      />
    </div>
  )
}