"use client";

import { useState, useEffect } from "react";
import { Alert, Button } from "@/components/ui";
import { createStaff, updateStaff } from "@/services/staff.service";
import { CreateStaffPayload, Department, Position, Staff } from "@/types/staff";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editData: Staff | null;
}

const initialForm: CreateStaffPayload = {
  name: "",
  email: "",
  phone: "",
  department: "sales",
  position: "salesman",
  salary: 0,
  joiningDate: "",
};

function getInitialForm(editData: Staff | null): CreateStaffPayload {
  if (!editData) return initialForm;
  return {
    name: editData.name,
    email: editData.email,
    phone: editData.phone,
    department: editData.department,
    position: editData.position,
    salary: editData.salary,
    joiningDate: editData.joiningDate ? editData.joiningDate.split("T")[0] : "",
  };
}

export default function StaffModal({
  open,
  onClose,
  onSuccess,
  editData,
}: Props) {
  const [form, setForm] = useState<CreateStaffPayload>(() =>
    getInitialForm(editData),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(getInitialForm(editData));
    setError("");
  }, [editData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        department: form.department as Department,
        position: form.position as Position,
      };
      if (editData) {
        await updateStaff(editData._id, payload);
      } else {
        await createStaff(payload);
      }
      onSuccess(
        editData
          ? "Staff updated successfully!"
          : "Staff created successfully!",
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {editData ? "Edit Staff" : "Add New Staff"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">
              {editData
                ? "Update staff member details."
                : "Fill in the details to add a new staff member."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <Alert type="error" message={error} />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ali Ahmed"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. ali@company.com"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 03001234567"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Salary */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Salary (PKR)
              </label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. 50000"
                min={0}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="sales">Sales</option>
                <option value="accounts">Accounts</option>
                <option value="hr">HR</option>
                <option value="stock">Stock</option>
              </select>
            </div>

            {/* Position */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="manager">Manager</option>
                <option value="salesman">Salesman</option>
                <option value="accountant">Accountant</option>
                <option value="stock incharge">Stock Incharge</option>
                <option value="hr officer">HR Officer</option>
              </select>
            </div>

            {/* Joining Date */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <Button type="submit" loading={loading} className="flex-1">
              {editData ? "Update Staff" : "Add Staff"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
