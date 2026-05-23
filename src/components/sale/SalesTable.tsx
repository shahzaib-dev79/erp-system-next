"use client";

import { Badge, Button, Card } from "@/components/ui";
import { Sale } from "@/types/sale";

import { PencilIcon, TrashIcon } from "lucide-react";

interface Props {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (value: boolean) => void;
  handleDeleteConfirm: () => void;
  deleteLoading: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 2,
});

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <TrashIcon className="h-6 w-6 text-red-600" />
        </div>

        <h2 className="mb-1 text-center text-lg font-semibold text-gray-900">
          Delete Sale
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Are you sure you want to delete this sale entry?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
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

function getPartyBadgeVariant(type: Sale["party"]["partyType"]) {
  if (type === "customer") return "info";
  if (type === "supplier") return "warning";
  if (type === "staff") return "success";
  return "default";
}

export default function SalesTable({
  sales,
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
        <div className="border-b border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900">
            All Sales ({sales.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3">Party</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No sales found.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {sale.party.name}
                        </div>
                        <Badge variant={getPartyBadgeVariant(sale.party.partyType)}>
                          {sale.party.partyType}
                        </Badge>
                      </div>
                    </td>

                    <td className="max-w-sm px-4 py-3 text-gray-600">
                      <span className="line-clamp-2">
                        {sale.products.join(", ")}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {quantityFormatter.format(sale.quantity)}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">
                      {currencyFormatter.format(sale.amount)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(sale)}
                          className="rounded-md bg-violet-50 p-1.5 text-violet-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onDelete(sale._id)}
                          className="rounded-md bg-red-50 p-1.5 text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
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
