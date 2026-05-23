"use client";

import { useCallback, useEffect, useState } from "react";

import AppNav from "@/components/layout/AppNav";
import SaleModal from "@/components/sale/SaleModal";
import SalesTable from "@/components/sale/SalesTable";
import { Alert, Spinner } from "@/components/ui";
import { useRequireAuth } from "@/lib/auth-context";
import { getAllParties } from "@/services/party.services";
import { deleteSale, getAllSales } from "@/services/sales.service";
import { Party } from "@/types/party";
import { Sale } from "@/types/sale";

import { PlusIcon } from "lucide-react";

export default function SalesPage() {
  const { isLoading } = useRequireAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Sale | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => setSuccess(""), 2000);
    return () => clearTimeout(timer);
  }, [success]);

  const fetchSalesData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setFetching(true);
      }

      setError("");

      const [salesData, partiesData] = await Promise.all([
        getAllSales(),
        getAllParties(),
      ]);

      setSales(salesData);
      setParties(partiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sales");
    } finally {
      if (showLoader) {
        setFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchSalesData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchSalesData]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      setError("");

      await deleteSale(deleteId);
      setSales((prev) => prev.filter((sale) => sale._id !== deleteId));
      setSuccess("Sale deleted successfully!");
      setShowDeleteModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sale");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
            <p className="mt-1 text-sm text-gray-500">
              Record, update, and track sales by party.
            </p>
          </div>

          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add Sale
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <SalesTable
          sales={sales}
          onEdit={(sale) => {
            setEditData(sale);
            setShowModal(true);
          }}
          onDelete={(id) => {
            setDeleteId(id);
            setShowDeleteModal(true);
          }}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteConfirm={handleDeleteConfirm}
          deleteLoading={deleteLoading}
        />
      </main>

      {showModal && (
        <SaleModal
          key={editData?._id ?? "new-sale"}
          open={showModal}
          onClose={() => setShowModal(false)}
          editData={editData}
          parties={parties}
          onSuccess={(message) => {
            void fetchSalesData(false);
            setSuccess(message);
          }}
        />
      )}
    </div>
  );
}
