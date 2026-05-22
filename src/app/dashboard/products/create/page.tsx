"use client";

import AppNav from "@/components/layout/AppNav";
import ProductForm from "@/components/products/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Product</h1>

        <ProductForm />
      </main>
    </div>
  );
}
