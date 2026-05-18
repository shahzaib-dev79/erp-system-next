"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui";
import { createAccount } from "@/services/account.service";
import { CreateAccountPayload } from "@/types/account";

interface Props {
  initialData?: CreateAccountPayload;
  isEdit?: boolean;
  onSubmitSuccess?: () => void;
}

export default function AccountForm({
  initialData,
  isEdit = false,
  onSubmitSuccess,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<CreateAccountPayload>(
    initialData || {
      ownerName: "",
      bankName: "",
      bankAccountNo: "",
      type: "bank",
      balance: 0,
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createAccount({
        ...form,
        balance: Number(form.balance),
      });

      setSuccess(
        isEdit
          ? "Account updated successfully!"
          : "Account created successfully!",
      );

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        setTimeout(() => {
          router.push("/dashboard/accounts");
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
          name="ownerName"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="bankName"
          placeholder="Bank Name (optional)"
          value={form.bankName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="bankAccountNo"
          placeholder="Bank Account Number"
          value={form.bankAccountNo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="bank">Bank</option>
          <option value="mobile-account">Mobile Account</option>
          <option value="cash">Cash</option>
        </select>

        <input
          type="number"
          name="balance"
          min={0}
          placeholder="Initial Balance"
          value={form.balance}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white p-2 rounded"
        >
          {loading
            ? "Processing..."
            : isEdit
              ? "Update Account"
              : "Create Account"}
        </button>
      </form>
    </div>
  );
}
