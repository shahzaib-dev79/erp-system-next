"use client";

import { useCallback, useEffect, useState } from "react";

import PartiesTable from "@/components/party/PartiesTable";
import PartyModal from "@/components/party/PartyModal";
import AppNav from "@/components/layout/AppNav";
import { Alert, Spinner } from "@/components/ui";
import { useRequireAuth } from "@/lib/auth-context";
import { deleteParty, getAllParties } from "@/services/party.services";
import { Party } from "@/types/party";

import { PlusIcon } from "lucide-react";

export default function PartiesPage() {
  const { isLoading } = useRequireAuth();
  const [parties, setParties] = useState<Party[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Party | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => setSuccess(""), 2000);
    return () => clearTimeout(timer);
  }, [success]);

  const fetchParties = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setFetching(true);
      }
      setError("");

      const data = await getAllParties();
      setParties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch parties");
    } finally {
      if (showLoader) {
        setFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchParties();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchParties]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      setError("");

      await deleteParty(deleteId);
      setParties((prev) => prev.filter((party) => party._id !== deleteId));
      setSuccess("Party deleted successfully!");
      setShowDeleteModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete party");
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
            <h1 className="text-2xl font-bold text-gray-900">Parties</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customers, suppliers, staff, and shared contacts.
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
            Add Party
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <PartiesTable
          parties={parties}
          onEdit={(party) => {
            setEditData(party);
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
        <PartyModal
          key={editData?._id ?? "new-party"}
          open={showModal}
          onClose={() => setShowModal(false)}
          editData={editData}
          onSuccess={(message) => {
            void fetchParties(false);
            setSuccess(message);
          }}
        />
      )}
    </div>
  );
}
