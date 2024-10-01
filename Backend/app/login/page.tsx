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
    <div className="min-h-screen flex items-center justify-center bg-[#1e2329]">
      <LoginModal
        isOpen={true}
        onClose={() => {}}
        onLogin={handleSuccessfulLogin}
      />
    </div>
  );
}