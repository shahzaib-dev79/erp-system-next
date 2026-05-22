"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui";
import { createProduct, updateProduct } from "@/services/product.services";
import { getAllParties } from "@/services/party.services";
import { CreateProductPayload } from "@/types/product";
import { Party } from "@/types/party";

interface Props {
  initialData?: CreateProductPayload & {
    _id?: string;
  };
  isEdit?: boolean;
  onSubmitSuccess?: () => void;
}

export default function ProductForm({
  initialData,
  isEdit = false,
  onSubmitSuccess,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [parties, setParties] = useState<Party[]>([]);
  const [form, setForm] = useState<CreateProductPayload>({
    name: "",
    price: "",
    quantity: "",
    description: "",
    sellerGroup: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const data = await getAllParties();
        setParties(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchParties();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };

      if (isEdit && initialData?._id) {
        await updateProduct(initialData._id, payload);
      } else {
        await createProduct(payload);
      }

      setSuccess(
        isEdit
          ? "Product updated successfully!"
          : "Product created successfully!",
      );

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          min={0}
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="quantity"
          min={0}
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="sellerGroup"
          value={form.sellerGroup}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Seller Group</option>

          {parties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white p-2 rounded"
        >
          {loading
            ? "Processing..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
      </form>
    </div>
  );
}
