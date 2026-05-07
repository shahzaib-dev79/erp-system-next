"use client";

import { useState, useEffect } from "react";
import AppNav from "@/components/layout/AppNav";
import { Alert, Button, Card, Spinner } from "@/components/ui";
import { useRequireAuth } from "@/lib/auth-context";
import {
  getAllAssets,
  createAsset,
  deleteAsset,
} from "@/services/asset.service";
import { Asset } from "@/types/asset";

export default function AssetsPage() {
  const { isLoading } = useRequireAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "current",
    value: "",
    description: "",
    purchaseDate: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchAssets = async () => {
    setFetching(true);
    try {
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);
    try {
      await createAsset({
        name: form.name,
        category: form.category as "current" | "fixed" | "intangible",
        value: Number(form.value),
        description: form.description,
        purchaseDate: form.purchaseDate,
      });
      setSuccess("Asset created successfully!");
      setForm({
        name: "",
        category: "current",
        value: "",
        description: "",
        purchaseDate: "",
      });
      fetchAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create asset");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this asset?")) return;
    setDeletingId(id);
    setError("");
    setSuccess("");
    try {
      await deleteAsset(id);
      setSuccess("Asset deleted successfully!");
      setAssets((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete asset");
    } finally {
      setDeletingId(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Assets</h1>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Create Asset Form */}
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Add New Asset</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Asset Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Company Laptop"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                  placeholder="e.g. 150000"
                  value={form.value}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, value: e.target.value }))
                  }
                  required
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                    setForm((f) => ({ ...f, purchaseDate: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell laptop for development"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={formLoading}>
                Add Asset
              </Button>
            </div>
          </form>
        </Card>

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
                  <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">Value</th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    Added By
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No assets found. Add one above!
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr
                      key={asset._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {asset.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${asset.category === "current" ? "bg-green-100 text-green-700" : ""}
                          ${asset.category === "fixed" ? "bg-violet-100 text-violet-700" : ""}
                          ${asset.category === "intangible" ? "bg-amber-100 text-amber-700" : ""}
                        `}
                        >
                          {asset.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        PKR {asset.value.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {asset.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {asset.createdBy?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          loading={deletingId === asset._id}
                          onClick={() => handleDelete(asset._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
