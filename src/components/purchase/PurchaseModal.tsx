"use client";

import { useEffect, useState } from "react";
import { Alert, Button } from "@/components/ui";
import { createPurchase, updatePurchase } from "@/services/purchase.service";
import { Party } from "@/types/party";
import { Product } from "@/types/product";
import { Purchase, CreatePurchasePayload } from "@/types/purchase";

import { X } from "lucide-react";

interface ItemForm {
	product: string;
	quantity: string;
	price: string;
	subPrice: number;
}

interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess: (message: string) => void;
	editData: Purchase | null;
	parties: Party[];
	products: Product[];
}

const getInitialItems = (editData: Purchase | null): ItemForm[] => {
	if (!editData) return [{ product: "", quantity: "", price: "", subPrice: 0 }];

	return editData.items.map((it) => ({
		product: it.product._id ?? (it.product as unknown as string),
		quantity: String(it.quantity),
		price: String(it.price),
		subPrice: it.subPrice,
	}));
};

export default function PurchaseModal({
	open,
	onClose,
	onSuccess,
	editData,
	parties,
	products,
}: Props) {
	const [code, setCode] = useState("");
	const [supplier, setSupplier] = useState("");
	const [items, setItems] = useState<ItemForm[]>(() => getInitialItems(null));
	const [paidAmount, setPaidAmount] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("cash");
	const [paymentStatus, setPaymentStatus] = useState("unpaid");
	const [date, setDate] = useState(
		() => new Date().toISOString().split("T")[0],
	);
	const [notes, setNotes] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (editData) {
			setCode(editData.purchaseCode || "");
			setSupplier(editData.supplier._id);
			setItems(getInitialItems(editData));
			setPaidAmount(String(editData.paidAmount ?? 0));
			setPaymentMethod(editData.paymentMethod ?? "cash");
			setPaymentStatus(editData.paymentStatus ?? "unpaid");
			setDate(editData.purchaseDate.split("T")[0]);
			setNotes(editData.notes ?? "");
		} else {
			setCode("");
			setSupplier("");
			setItems([{ product: "", quantity: "", price: "", subPrice: 0 }]);
			setPaidAmount("");
			setPaymentMethod("cash");
			setPaymentStatus("unpaid");
			setDate(new Date().toISOString().split("T")[0]);
			setNotes("");
		}
	}, [editData, open]);

	const updateItem = (index: number, partial: Partial<ItemForm>) => {
		setItems((prev) => {
			const next = [...prev];
			next[index] = { ...next[index], ...partial };
			const qty = Number(next[index].quantity) || 0;
			const price = Number(next[index].price) || 0;
			next[index].subPrice = Number((qty * price).toFixed(2));
			return next;
		});
	};

	const addItem = () =>
		setItems((s) => [
			...s,
			{ product: "", quantity: "", price: "", subPrice: 0 },
		]);
	const removeItem = (i: number) =>
		setItems((s) => s.filter((_, idx) => idx !== i));

	const totalAmount = items.reduce((acc, it) => acc + (it.subPrice || 0), 0);
	const dueAmount = totalAmount - (Number(paidAmount) || 0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!code) {
			setError("Purchase code is required");
			return;
		}

		if (!supplier) {
			setError("Select a supplier");
			return;
		}

		if (items.length === 0 || items.some((it) => !it.product)) {
			setError("Add at least one item with a product selected");
			return;
		}

		const payload: CreatePurchasePayload = {
			purchaseCode: code,
			supplier,
			items: items.map((it) => ({
				product: it.product,
				quantity: Number(it.quantity),
				price: Number(it.price),
				subPrice: it.subPrice,
			})),
			totalAmount: Number(totalAmount.toFixed(2)),
			paidAmount: Number(paidAmount) || 0,
			dueAmount: Number(dueAmount.toFixed(2)),
			paymentMethod,
			paymentStatus,
			purchaseDate: date,
			notes,
		};

		try {
			setLoading(true);
			setError("");

			if (editData) {
				await updatePurchase(editData._id, payload);
				onSuccess("Purchase updated successfully!");
			} else {
				await createPurchase(payload);
				onSuccess("Purchase created successfully!");
			}

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
				className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between p-6 pb-0">
					<div>
						<h2 className="text-lg font-semibold text-slate-800">
							{editData ? "Edit Purchase" : "Add New Purchase"}
						</h2>
						<p className="mt-0.5 text-sm text-slate-400">
							{editData ? "Update purchase details." : "Record a new purchase."}
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

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Purchase Code
							</label>
							<input
								value={code}
								onChange={(e) => setCode(e.target.value)}
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
								required
							/>
						</div>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">
								Supplier
							</label>
							<select
								value={supplier}
								onChange={(e) => setSupplier(e.target.value)}
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
								required>
								<option value="">Select a supplier</option>
								{parties.map((p) => (
									<option key={p._id} value={p._id}>
										{p.name}
									</option>
								))}
							</select>
						</div>

						<div className="sm:col-span-2">
							<label className="block text-sm font-medium text-gray-700">
								Items
							</label>
							<div className="space-y-3">
								{items.map((it, idx) => (
									<div key={idx} className="grid grid-cols-12 gap-2 items-end">
										<select
											value={it.product}
											onChange={(e) =>
												updateItem(idx, { product: e.target.value })
											}
											className="col-span-5 rounded-lg border border-gray-300 px-3 py-2 text-sm">
											<option value="">Select product</option>
											{products.map((pr) => (
												<option key={pr._id} value={pr._id}>
													{pr.name}
												</option>
											))}
										</select>

										<input
											type="number"
											min="0"
											step="0.01"
											placeholder="Qty"
											value={it.quantity}
											onChange={(e) =>
												updateItem(idx, { quantity: e.target.value })
											}
											className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
										/>

										<input
											type="number"
											min="0"
											step="0.01"
											placeholder="Price"
											value={it.price}
											onChange={(e) =>
												updateItem(idx, { price: e.target.value })
											}
											className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
										/>

										<div className="col-span-2 text-sm text-gray-700">
											{it.subPrice.toFixed(2)}
										</div>

										<div className="col-span-1">
											<button
												type="button"
												onClick={() => removeItem(idx)}
												className="text-red-600">
												Remove
											</button>
										</div>
									</div>
								))}

								<button
									type="button"
									onClick={addItem}
									className="text-sm text-violet-600">
									+ Add item
								</button>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Purchase Date
							</label>
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Paid Amount
							</label>
							<input
								type="number"
								min="0"
								step="0.01"
								value={paidAmount}
								onChange={(e) => setPaidAmount(e.target.value)}
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Payment Method
							</label>
							<select
								value={paymentMethod}
								onChange={(e) => setPaymentMethod(e.target.value)}
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
								<option value="cash">Cash</option>
								<option value="bank">Bank</option>
								<option value="mobile-account">Mobile Account</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Payment Status
							</label>
							<select
								value={paymentStatus}
								onChange={(e) => setPaymentStatus(e.target.value)}
								className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
								<option value="unpaid">Unpaid</option>
								<option value="partial">Partial</option>
								<option value="paid">Paid</option>
							</select>
						</div>

						<div className="sm:col-span-2">
							<label className="block text-sm font-medium text-gray-700">
								Notes
							</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={3}
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

						<Button type="submit" loading={loading} className="flex-1">
							{editData ? "Update Purchase" : "Add Purchase"}
						</Button>
					</div>

					<div className="pt-2 text-sm text-gray-700">
						Total: <span className="font-medium">{totalAmount.toFixed(2)}</span>{" "}
						— Due: <span className="font-medium">{dueAmount.toFixed(2)}</span>
					</div>
				</form>
			</div>
		</div>
	);
}
