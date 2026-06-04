"use client";

import { useState } from "react";

import { Alert, Button } from "@/components/ui";
import { createSale, updateSale } from "@/services/sales.service";
import { Party } from "@/types/party";
import { Sale, SaleFormValues } from "@/types/sale";

import { X } from "lucide-react";

interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess: (message: string) => void;
	editData: Sale | null;
	parties: Party[];
}

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getInitialForm = (editData: Sale | null): SaleFormValues => {
	if (!editData) {
		return {
			party: "",
			productsText: "",
			date: getTodayDate(),
			quantity: "",
			amount: "",
		};
	}

	return {
		party: editData.party._id,
		productsText: editData.products.join(", "),
		date: editData.date.split("T")[0],
		quantity: String(editData.quantity),
		amount: String(editData.amount),
	};
};

export default function SaleModal({
	open,
	onClose,
	onSuccess,
	editData,
	parties,
}: Props) {
	const [form, setForm] = useState<SaleFormValues>(() =>
		getInitialForm(editData),
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (
		event: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = event.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const products = form.productsText
			.split(/[\n,]+/)
			.map((product) => product.trim())
			.filter(Boolean);

		if (!products.length) {
			setError("Enter at least one product.");
			return;
		}

		if (!form.party) {
			setError("Select a party for this sale.");
			return;
		}

		try {
			setLoading(true);
			setError("");

			const payload = {
				party: form.party,
				products,
				date: form.date,
				quantity: Number(form.quantity),
				amount: Number(form.amount),
			};

			if (editData) {
				await updateSale(editData._id, payload);
			} else {
				await createSale(payload);
			}

			onSuccess(
				editData ? "Sale updated successfully!" : "Sale created successfully!",
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
			onClick={onClose}>
			<div
				className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
				onClick={(event) => event.stopPropagation()}>
				<div className="flex items-center justify-between p-6 pb-0">
					<div>
						<h2 className="text-lg font-semibold text-slate-800">
							{editData ? "Edit Sale" : "Add New Sale"}
						</h2>
						<p className="mt-0.5 text-sm text-slate-400">
							{editData
								? "Update the sales entry below."
								: "Record a sale against one of your parties."}
						</p>
					</div>

					<button
						onClick={onClose}
						className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4 p-6">
					{error && <Alert type="error" message={error} />}

					{parties.length === 0 && (
						<Alert
							type="info"
							message="Create a party first before recording a sale."
						/>
					)}

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Party
							</label>
							<select
								name="party"
								value={form.party}
								onChange={handleChange}
								required
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
								<option value="">Select a party</option>
								{parties.map((party) => (
									<option key={party._id} value={party._id}>
										{party.name} ({party.partyType})
									</option>
								))}
							</select>
						</div>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Sale Date
							</label>
							<input
								type="date"
								name="date"
								value={form.date}
								onChange={handleChange}
								required
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
							/>
						</div>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Quantity
							</label>
							<input
								type="number"
								name="quantity"
								value={form.quantity}
								onChange={handleChange}
								min="0.01"
								step="0.01"
								required
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
							/>
						</div>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Amount (PKR)
							</label>
							<input
								type="number"
								name="amount"
								value={form.amount}
								onChange={handleChange}
								min="0.01"
								step="0.01"
								required
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
							/>
						</div>

						<div className="space-y-1 sm:col-span-2">
							<label className="block text-sm font-medium text-gray-700">
								Products
							</label>
							<textarea
								name="productsText"
								value={form.productsText}
								onChange={handleChange}
								rows={4}
								required
								placeholder="Enter product names separated by commas or new lines"
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
							/>
						</div>
					</div>

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium">
							Cancel
						</button>

						<Button
							type="submit"
							loading={loading}
							className="flex-1"
							disabled={parties.length === 0}>
							{editData ? "Update Sale" : "Add Sale"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
