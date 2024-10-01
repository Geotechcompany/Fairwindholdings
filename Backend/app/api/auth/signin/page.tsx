'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { AdminLoginForm } from '@/components/AdminLoginForm'

export default function SignIn() {
  const searchParams = useSearchParams() ?? new URLSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'

  const onSubmit = async (email: string, password: string) => {
    await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <AdminLoginForm onSubmit={onSubmit} />
      </div>
    </div>
  )
}