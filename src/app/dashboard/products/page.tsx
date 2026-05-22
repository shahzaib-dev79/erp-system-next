"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Spinner } from "@/components/ui";
import AppNav from "@/components/layout/AppNav";
import { useRequireAuth } from "@/lib/auth-context";
import { getAllProducts, deleteProduct } from "@/services/product.services";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import ProductTable from "@/components/products/ProductTable";
import { Plus } from "lucide-react";

export default function ProductPage() {
  const { isLoading } = useRequireAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 1000);

    return () => clearTimeout(timer);
  }, [success]);

  const fetchProducts = useCallback(async () => {
    try {
      setFetching(true);

      setError("");

      const data = await getAllProducts();

      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this product?");

    if (!ok) return;

    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product._id !== id));

      setSuccess("Product deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/dashboard/products/update/${product._id}`);
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
            <h1 className="text-2xl font-bold">Products</h1>

            <p className="text-sm text-gray-500 mt-1">Manage all products</p>
          </div>

          <button
            onClick={() => router.push("/dashboard/products/create")}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {error && <Alert type="error" message={error} />}

        {success && <Alert type="success" message={success} />}

        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
