"use client";

import React from 'react';
import RegisterModal from '@/components/RegisterModal';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccessfulRegistration = () => {
    router.push('/trading-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e2329]">
      <RegisterModal
        isOpen={true}
        onClose={() => {}}
        isStandalone={true}
        onSuccessfulRegistration={handleSuccessfulRegistration}
      />
    </div>
  );
}