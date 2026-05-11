"use client";

import { useEffect, useState } from "react";

import { Alert, Button } from "@/components/ui";

import { createAsset, updateAsset } from "@/services/asset.service";

import { Asset } from "@/types/asset";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: Asset | null;
}

export default function AssetModal({
  open,
  onClose,
  onSuccess,
  editData,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    category: "current",
    value: "",
    description: "",
    purchaseDate: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        category: editData.category,
        value: String(editData.value),
        description: editData.description || "",
        purchaseDate: editData.purchaseDate
          ? editData.purchaseDate.split("T")[0]
          : "",
      });
    } else {
      setForm({
        name: "",
        category: "current",
        value: "",
        description: "",
        purchaseDate: "",
      });
    }

    setError("");
  }, [editData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const payload = {
        name: form.name,
        category: form.category as "current" | "fixed" | "intangible",
        value: Number(form.value),
        description: form.description,
        purchaseDate: form.purchaseDate,
      };

      if (editData) {
        await updateAsset(editData._id, payload);
      } else {
        await createAsset(payload);
      }

      onSuccess();

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {editData ? "Edit Asset" : "Add New Asset"}
            </h2>

            <p className="text-sm text-slate-400 mt-0.5">
              {editData
                ? "Update asset information"
                : "Fill in the details to add a new asset"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <Alert type="error" message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Asset Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="current">Current</option>

                <option value="fixed">Fixed</option>

                <option value="intangible">Intangible</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Value (PKR)
              </label>

              <input
                type="number"
                value={form.value}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Purchase Date
              </label>

              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    purchaseDate: e.target.value,
                  }))
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>

              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300"
            >
              Cancel
            </button>

            <Button type="submit" loading={loading} className="flex-1">
              {editData ? "Update Asset" : "Add Asset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
