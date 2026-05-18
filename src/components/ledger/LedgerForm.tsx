"use client";

import { useState } from "react";
import { CreateLedgerPayload, Ledger } from "@/types/ledger";

interface Props {
  initialData?: Ledger;
  onSubmit: (data: CreateLedgerPayload) => void;
  loading?: boolean;

  accounts: {
    _id: string;
    ownerName: string;
  }[];

  parties: {
    _id: string;
    name: string;
  }[];
}

export default function LedgerForm({
  initialData,
  onSubmit,
  loading = false,
  accounts = [],
  parties = [],
}: Props) {
  const [form, setForm] = useState({
    code: initialData?.code || "",
    accounts: initialData?.accounts?._id || "",
    party: initialData?.party?._id || "",
    debit: initialData?.debit?.toString() || "",
    credit: initialData?.credit?.toString() || "",
    type: initialData?.type || "sale",
    description: initialData?.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...form,
      debit: form.debit === "" ? 0 : Number(form.debit),
      credit: form.credit === "" ? 0 : Number(form.credit),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <input
        name="code"
        value={form.code}
        onChange={handleChange}
        placeholder="Ledger Code"
        className="w-full border p-2 rounded"
        required
      />

      {/* Accounts */}
      <select
        name="accounts"
        value={form.accounts}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select Account</option>

        {accounts.map((acc) => (
          <option key={acc._id} value={acc._id}>
            {acc.ownerName}
          </option>
        ))}
      </select>

      {/* Parties */}
      <select
        name="party"
        value={form.party}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select Party</option>

        {parties.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={0}
        name="debit"
        value={form.debit}
        onChange={handleChange}
        placeholder="Debit"
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        min={0}
        name="credit"
        value={form.credit}
        onChange={handleChange}
        placeholder="Credit"
        className="w-full border p-2 rounded"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="sale">Sale</option>
        <option value="purchase">Purchase</option>
        <option value="expense">Expense</option>
        <option value="salary">Salary</option>
      </select>

      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-600 text-white p-2 rounded"
      >
        {loading
          ? "Saving..."
          : initialData
            ? "Update Ledger"
            : "Create Ledger"}
      </button>
    </form>
  );
}
