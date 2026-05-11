"use client";

import { useEffect, useState } from "react";

import AppNav from "@/components/layout/AppNav";
import { Alert, Spinner } from "@/components/ui";

import AssetModal from "../../../components/asset/AssetModal";
import AssetsTable from "../../../components/asset/AssetsTable";

import { useRequireAuth } from "@/lib/auth-context";

import { deleteAsset, getAllAssets } from "@/services/asset.service";

import { Asset } from "@/types/asset";

import { PlusIcon } from "lucide-react";

export default function AssetsPage() {
  const { isLoading } = useRequireAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Asset | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchAssets = async () => {
    try {
      setFetching(true);
      const data = await getAllAssets();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      await deleteAsset(deleteId);

      setAssets((prev) => prev.filter((asset) => asset._id !== deleteId));

      setSuccess("Asset deleted successfully!");

      setShowDeleteModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch assets");
      }
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Assets</h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your company assets
            </p>
          </div>

          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Asset
          </button>
        </div>

        {error && <Alert type="error" message={error} />}

        {success && <Alert type="success" message={success} />}

        <AssetsTable
          assets={assets}
          onEdit={(asset) => {
            setEditData(asset);
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

      <AssetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onSuccess={() => {
          fetchAssets();

          setSuccess(
            editData
              ? "Asset updated successfully!"
              : "Asset created successfully!",
          );
        }}
      />
    </div>
  );
}
