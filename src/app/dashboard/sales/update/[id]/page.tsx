"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppNav from "@/components/layout/AppNav";
import LedgerForm from "@/components/ledger/LedgerForm";
import { Alert, Spinner } from "@/components/ui";
import { getLedgerById, updateLedger } from "@/services/ledger.service";
import { Ledger, CreateLedgerPayload } from "@/types/ledger";
import { getAllAccounts } from "@/services/account.service";
import { getAllParties } from "@/services/party.services";

export default function UpdateLedgerPage() {
  const params = useParams();
  const router = useRouter();
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [accounts, setAccounts] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ledgerData, accData, partyData] = await Promise.all([
          getLedgerById(params.id as string),
          getAllAccounts(),
          getAllParties(),
        ]);

        setLedger(ledgerData);
        setAccounts(accData);
        setParties(partyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (data: CreateLedgerPayload) => {
    try {
      await updateLedger(params.id as string, data);
      router.push("/dashboard/ledger");
    } catch (error) {
      console.log(error);
    }
  };

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

      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white border rounded-2xl shadow-sm p-6">
          <h1 className="text-xl font-bold mb-6 text-center">Update Ledger</h1>

          {ledger && (
            <LedgerForm
              initialData={ledger}
              onSubmit={handleSubmit}
              accounts={accounts}
              parties={parties}
            />
          )}
        </div>
      </main>
    </div>
  );
}
