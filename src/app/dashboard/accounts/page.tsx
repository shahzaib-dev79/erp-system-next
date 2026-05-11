"use client";

import { useCallback, useEffect, useState } from "react";
import AppNav from "@/components/layout/AppNav";
import { Alert, Spinner } from "@/components/ui";
import AccountsTable from "@/components/accounts/AccountsTable";
import { useRequireAuth } from "@/lib/auth-context";
import { getAllAccounts, deleteAccount } from "@/services/account.service";
import { useRouter } from "next/navigation";
import { Account } from "@/types/account";
import { PlusIcon } from "lucide-react";

export default function AccountsPage() {
  const { isLoading } = useRequireAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2000);
    return () => clearTimeout(timer);
  }, [success]);

  const fetchAccounts = useCallback(async () => {
    try {
      setFetching(true);
      setError("");

      const data = await getAllAccounts();
      setAccounts(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accounts");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this account?");
    if (!ok) return;

    try {
      await deleteAccount(id);

      setAccounts((prev) => prev.filter((acc) => acc._id !== id));

      setSuccess("Account deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleEdit = (account: Account) => {
    router.push(`/dashboard/accounts/update/${account._id}`);
  };

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accounts</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all financial accounts
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/accounts/create")}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg"
          >
            <PlusIcon className="w-4 h-4" />
            Add Account
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <AccountsTable
          accounts={accounts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
