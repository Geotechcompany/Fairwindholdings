import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
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
      />
    </div>
  );
}