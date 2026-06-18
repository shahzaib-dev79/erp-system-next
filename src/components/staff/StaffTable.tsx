"use client";

import { Badge, Button, Card } from "@/components/ui";
import { Staff } from "@/types/staff";
import { PencilIcon, TrashIcon } from "lucide-react";

interface Props {
  staffList: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (id: string, isActive: boolean) => void;
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <TrashIcon className="h-6 w-6 text-red-600" />
        </div>

        <h2 className="mb-1 text-center text-lg font-semibold text-gray-900">
          Delete Staff
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Are you sure you want to delete this staff member? This action cannot
          be undone.
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

function getDepartmentVariant(department: string) {
  if (department === "sales") return "success";
  if (department === "accounts") return "info";
  if (department === "hr") return "warning";
  if (department === "stock") return "default";
  return "default";
}

function getPositionVariant(position: string) {
  if (position === "manager") return "danger";
  if (position === "salesman") return "success";
  if (position === "accountant") return "info";
  if (position === "stock incharge") return "default";
  if (position === "hr officer") return "warning";
  return "default";
}

export default function StaffTable({
  staffList,
  onEdit,
  onDelete,
  onStatusToggle,
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
            All Staff ({staffList.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Department
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Position
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">Salary</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {staffList.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No staff found. Click Add Staff to add one!
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {staff.name}
                    </td>

                    <td className="px-4 py-3 text-gray-600">{staff.email}</td>

                    <td className="px-4 py-3 text-gray-600">{staff.phone}</td>

                    <td className="px-4 py-3">
                      <Badge variant={getDepartmentVariant(staff.department)}>
                        {staff.department.charAt(0).toUpperCase() +
                          staff.department.slice(1)}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={getPositionVariant(staff.position)}>
                        {staff.position.charAt(0).toUpperCase() +
                          staff.position.slice(1)}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      PKR {staff.salary.toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          onStatusToggle(staff._id, staff.isActive)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          staff.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {staff.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(staff)}
                          className="rounded-md bg-violet-50 p-1.5 text-violet-600 hover:bg-violet-100 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onDelete(staff._id)}
                          className="rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors"
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
