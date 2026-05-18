"use client";

import { Badge, Button, Card } from "@/components/ui";
import { Party, PartyType } from "@/types/party";

import { PencilIcon, TrashIcon } from "lucide-react";

interface Props {
  parties: Party[];
  onEdit: (party: Party) => void;
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
          Delete Party
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Are you sure you want to delete this party?
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

function getPartyBadgeVariant(type: PartyType) {
  if (type === "customer") return "info";
  if (type === "supplier") return "warning";
  if (type === "staff") return "success";
  return "default";
}

function formatPartyType(type: PartyType) {
  if (type === "both") return "Customer + Supplier";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function PartiesTable({
  parties,
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
            All Parties ({parties.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {parties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No parties found.
                  </td>
                </tr>
              ) : (
                parties.map((party) => (
                  <tr key={party._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {party.name}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={getPartyBadgeVariant(party.partyType)}>
                        {formatPartyType(party.partyType)}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">{party.phoneNumber}</td>
                    <td className="px-4 py-3">{party.email || "-"}</td>
                    <td className="max-w-xs px-4 py-3 text-gray-600">
                      <span className="line-clamp-2">{party.address}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(party)}
                          className="rounded-md bg-violet-50 p-1.5 text-violet-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onDelete(party._id)}
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
