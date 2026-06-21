"use client";

import { useCallback, useEffect, useState } from "react";
import AppNav from "@/components/layout/AppNav";
import { Alert, Spinner } from "@/components/ui";
import LedgerTable from "@/components/ledger/LedgerTable";
import { useRequireAuth } from "@/lib/auth-context";
import { getAllLedgers, deleteLedger } from "@/services/ledger.service";
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

  // Auto-clear feedback messages (both success and error)
  useEffect(() => {
    if (!success && !error) return;
    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [success, error]);

  // Fetch ledgers
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
    if (!isLoading) {
      fetchLedgers();
    }
  }, [fetchLedgers, isLoading]);

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

  // FIX: Only block the whole page layout for Authentication loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // FIX: Corrected implicit return wrapper for filter mapping
  const purchaseLedgers = ledgers.filter((entry) => entry.type === "purchase");

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Purchases</h1>

          <button
            onClick={() => router.push("/dashboard/purchase/create")}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Ledger
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Better UX: Show internal loading indicator instead of destroying layout */}
        {fetching && ledgers.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <LedgerTable
            ledgers={purchaseLedgers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
