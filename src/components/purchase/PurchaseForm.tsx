"use client";

import { useState } from "react";
import { CreateLedgerPayload, Ledger, LedgerType } from "@/types/ledger";

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

	fixedType?: LedgerType;
}

export default function LedgerForm({
	initialData,
	onSubmit,
	loading = false,
	accounts = [],
	parties = [],
	fixedType,
}: Props) {
	const [form, setForm] = useState({
		code: initialData?.code || "",
		accounts: initialData?.accounts?._id || "",
		party: initialData?.party?._id || "",
		debit: initialData?.debit?.toString() || "",
		credit: initialData?.credit?.toString() || "",
		type: "purchase",
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
			type: fixedType || form.type,
			debit: form.debit === "" ? 0 : Number(form.debit),
			credit: form.credit === "" ? 0 : Number(form.credit),
		});
	};

	const fixedTypeLabel = fixedType
		? fixedType.charAt(0).toUpperCase() + fixedType.slice(1)
		: "";

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-6 rounded-xl shadow space-y-4">
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
				required>
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
				required>
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
				className="w-full bg-violet-600 text-white p-2 rounded">
				{loading
					? "Saving..."
					: initialData
						? "Update Ledger"
						: "Create Ledger"}
			</button>
		</form>
	);
}
