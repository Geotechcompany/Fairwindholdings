"use client";

import React from 'react';
import LoginModal from '@/components/LoginModal';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    router.push('/trading-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/login-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <LoginModal
        isOpen={true}
        onClose={() => {}}
        onLogin={handleSuccessfulLogin}
      />
    </div>
  );
}