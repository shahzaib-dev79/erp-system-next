"use client";

import { useCallback, useEffect, useState } from "react";
import AppNav from "@/components/layout/AppNav";
import { Alert, Spinner } from "@/components/ui";
import LedgerTable from "@/components/ledger/LedgerTable";
import { useRequireAuth } from "@/lib/auth-context";
import { getAllLedgers, deleteLedger } from "@/services/ledger.service";
import { getAllAccounts } from "@/services/account.service";
import { getAllParties } from "@/services/party.services";
import { useRouter } from "next/navigation";
import { Ledger } from "@/types/ledger";
import { PlusIcon } from "lucide-react";

export default function LedgerPage() {
  const { isLoading } = useRequireAuth();
  const router = useRouter();

  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // auto clear success
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2000);
    return () => clearTimeout(timer);
  }, [success]);

  // fetch ledgers
  const fetchLedgers = useCallback(async () => {
    try {
      setFetching(true);
      const data = await getAllLedgers();
      setLedgers(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch ledgers");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchLedgers();
  }, [fetchLedgers]);

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this ledger?");
    if (!ok) return;

    try {
      await deleteLedger(id);
      setLedgers((prev) => prev.filter((l) => l._id !== id));
      setSuccess("Deleted successfully");
    } catch {
      setError("Delete failed");
    }
  };

  const handleEdit = (ledger: Ledger) => {
    router.push(`/dashboard/ledger/update/${ledger._id}`);
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Journal Ledger</h1>

          <button
            onClick={() => router.push("/dashboard/ledger/create")}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg"
          >
            <PlusIcon className="w-4 h-4" />
            Add Ledger
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <LedgerTable
          ledgers={ledgers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
