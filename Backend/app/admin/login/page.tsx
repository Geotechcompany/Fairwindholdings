import { AdminLoginForm } from '@/components/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}