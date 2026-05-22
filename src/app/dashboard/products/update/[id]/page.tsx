"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppNav from "@/components/layout/AppNav";
import ProductForm from "@/components/products/ProductForm";
import { Alert, Spinner } from "@/components/ui";
import { getProductById } from "@/services/product.services";
import { CreateProductPayload } from "@/types/product";

export default function UpdateProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<
    (CreateProductPayload & { _id: string }) | null
  >(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(id);

      setProduct({
        _id: data._id,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
        sellerGroup: data.sellerGroup._id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      await fetchProduct();
    };

    load();
  }, [id, fetchProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Product</h1>

        {product && (
          <ProductForm
            initialData={product}
            isEdit={true}
            onSubmitSuccess={() => router.push("/dashboard/products")}
          />
        )}
      </main>
    </div>
  );
}
