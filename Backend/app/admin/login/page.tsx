import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/admin-login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md relative z-10">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
