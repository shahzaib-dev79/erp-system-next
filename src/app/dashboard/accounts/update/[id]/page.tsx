"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppNav from "@/components/layout/AppNav";
import AccountForm from "@/components/accounts/AccountForm";
import { Alert, Spinner } from "@/components/ui";
import { getAccountById } from "@/services/account.service";
import { Account, CreateAccountPayload } from "@/types/account";

export default function UpdateAccountPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<CreateAccountPayload | null>(null);
  const fetchAccount = async () => {
    try {
      setLoading(true);
      setError("");

      const data: Account = await getAccountById(id);
      setAccount({
        ownerName: data.ownerName,
        bankName: data.bankName || "",
        bankAccountNo: data.bankAccountNo,
        type: data.type,
        balance: data.balance,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAccount();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Account</h1>

        {account && (
          <AccountForm
            initialData={account}
            isEdit={true}
            accountId={id}
            onSubmitSuccess={() => {
              router.push("/dashboard/accounts");
            }}
          />
        )}
      </main>
    </div>
  );
}
