"use client";

import { Card, Button } from "@/components/ui";

import { Asset } from "@/types/asset";

import { PencilIcon, TrashIcon } from "lucide-react";

interface Props {
  assets: Asset[];

  onEdit: (asset: Asset) => void;

  onDelete: (id: string) => void;

  showDeleteModal: boolean;

  setShowDeleteModal: (value: boolean) => void;

  handleDeleteConfirm: () => void;

  deleteLoading: boolean;
}

function DeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <TrashIcon className="w-6 h-6 text-red-600" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
          Delete Asset
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete this asset?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300"
          >
            Cancel
          </button>

          <Button
            variant="danger"
            loading={loading}
            onClick={onConfirm}
            className="flex-1"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AssetsTable({
  assets,
  onEdit,
  onDelete,
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteConfirm,
  deleteLoading,
}: Props) {
  return (
    <>
      <Card>
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            All Assets ({assets.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left">
                <th className="px-4 py-3">Name</th>

                <th className="px-4 py-3">Category</th>

                <th className="px-4 py-3">Value</th>

                <th className="px-4 py-3">Description</th>

                <th className="px-4 py-3">Added By</th>

                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {assets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No assets found.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{asset.name}</td>

                    <td className="px-4 py-3">{asset.category}</td>

                    <td className="px-4 py-3">
                      PKR {asset.value.toLocaleString()}
                    </td>

                    <td className="px-4 py-3">{asset.description || "—"}</td>

                    <td className="px-4 py-3">
                      {asset.createdBy?.name || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(asset)}
                          className="p-1.5 rounded-md bg-violet-50 text-violet-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDelete(asset._id)}
                          className="p-1.5 rounded-md bg-red-50 text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
}
