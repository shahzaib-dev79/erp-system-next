"use client";

import AppNav from "@/components/layout/AppNav";
import AccountForm from "@/components/accounts/AccountForm";

export default function CreateAccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <AccountForm />
      </main>
    </div>
  );
}
