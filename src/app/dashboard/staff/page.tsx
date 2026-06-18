"use client";

import { useCallback, useEffect, useState } from "react";
import AppNav from "@/components/layout/AppNav";
import { Alert, Spinner } from "@/components/ui";
import { useRequireAuth } from "@/lib/auth-context";
import {
  getAllStaff,
  deleteStaff,
  updateStaffStatus,
} from "@/services/staff.service";
import { Staff } from "@/types/staff";
import StaffTable from "@/components/staff/StaffTable";
import StaffModal from "@/components/staff/StaffModal";
import { PlusIcon } from "lucide-react";

export default function StaffPage() {
  const { isLoading } = useRequireAuth();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Staff | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Success message 2 seconds baad gayab ho jaye
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2000);
    return () => clearTimeout(timer);
  }, [success]);

  // Sab staff fetch karo
  const fetchStaff = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setFetching(true);
      setError("");
      const data = await getAllStaff();
      setStaffList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch staff");
    } finally {
      if (showLoader) setFetching(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchStaff();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchStaff]);

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      setError("");
      await deleteStaff(deleteId);
      setStaffList((prev) => prev.filter((s) => s._id !== deleteId));
      setSuccess("Staff deleted successfully!");
      setShowDeleteModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete staff");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // Status toggle
  const handleStatusToggle = async (id: string, isActive: boolean) => {
    try {
      setError("");
      await updateStaffStatus(id, !isActive);
      setStaffList((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !isActive } : s)),
      );
      setSuccess(
        `Staff ${!isActive ? "activated" : "deactivated"} successfully!`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update staff status",
      );
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your company staff members.
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
            Add Staff
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Table */}
        <StaffTable
          staffList={staffList}
          onEdit={(staff) => {
            setEditData(staff);
            setShowModal(true);
          }}
          onDelete={(id) => {
            setDeleteId(id);
            setShowDeleteModal(true);
          }}
          onStatusToggle={handleStatusToggle}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteConfirm={handleDeleteConfirm}
          deleteLoading={deleteLoading}
        />
      </main>

      {/* Modal */}
      {showModal && (
        <StaffModal
          key={editData?._id ?? "new-staff"}
          open={showModal}
          onClose={() => setShowModal(false)}
          editData={editData}
          onSuccess={(message) => {
            void fetchStaff(false);
            setSuccess(message);
          }}
        />
      )}
    </div>
  );
}
