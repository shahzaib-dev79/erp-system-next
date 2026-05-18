"use client";

import { useState } from "react";

import { Alert, Button } from "@/components/ui";
import { createParty, updateParty } from "@/services/party.services";
import { CreatePartyPayload, Party, PartyType } from "@/types/party";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editData: Party | null;
}

const initialForm: CreatePartyPayload = {
  name: "",
  partyType: "customer",
  email: "",
  phoneNumber: "",
  address: "",
};

function getInitialForm(editData: Party | null): CreatePartyPayload {
  if (!editData) {
    return initialForm;
  }

  return {
    name: editData.name,
    partyType: editData.partyType,
    email: editData.email || "",
    phoneNumber: editData.phoneNumber,
    address: editData.address,
  };
}

export default function PartyModal({
  open,
  onClose,
  onSuccess,
  editData,
}: Props) {
  const [form, setForm] = useState<CreatePartyPayload>(() =>
    getInitialForm(editData),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      partyType: form.partyType as PartyType,
      email: form.email?.trim() || undefined,
      phoneNumber: form.phoneNumber.trim(),
      address: form.address.trim(),
    };

    try {
      setLoading(true);
      setError("");

      if (editData) {
        await updateParty(editData._id, payload);
      } else {
        await createParty(payload);
      }

      onSuccess(
        editData
          ? "Party updated successfully!"
          : "Party created successfully!",
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
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {editData ? "Edit Party" : "Add New Party"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">
              {editData
                ? "Update the party details below."
                : "Create a new customer, supplier, staff member, or shared contact."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <Alert type="error" message={error} />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Party Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={50}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Party Type
              </label>
              <select
                name="partyType"
                value={form.partyType}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="both">Both</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>

            <Button type="submit" loading={loading} className="flex-1">
              {editData ? "Update Party" : "Add Party"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
