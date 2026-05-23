"use client";

import { useCallback, useEffect, useState } from "react";

import AppNav from "@/components/layout/AppNav";
import PurchaseModal from "@/components/purchase/PurchaseModal";
import PurchasesTable from "@/components/purchase/PurchasesTable";
import { Alert, Spinner } from "@/components/ui";
import { useRequireAuth } from "@/lib/auth-context";
import { getAllParties } from "@/services/party.services";
import { getAllProducts } from "@/services/product.services";
import { deletePurchase, getAllPurchases } from "@/services/purchase.service";
import { Party } from "@/types/party";
import { Purchase } from "@/types/purchase";

import { PlusIcon } from "lucide-react";

export default function PurchasesPage() {
	const { isLoading } = useRequireAuth();
	const [purchases, setPurchases] = useState<Purchase[]>([]);
	const [parties, setParties] = useState<Party[]>([]);
	const [products, setProducts] = useState<any[]>([]);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [editData, setEditData] = useState<Purchase | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	useEffect(() => {
		if (!success) return;

		const timer = setTimeout(() => setSuccess(""), 2000);
		return () => clearTimeout(timer);
	}, [success]);

	const fetchData = useCallback(async (showLoader = true) => {
		try {
			if (showLoader) setFetching(true);
			setError("");

			const [purchasesData, partiesData, productsData] = await Promise.all([
				getAllPurchases(),
				getAllParties(),
				getAllProducts(),
			]);

			setPurchases(purchasesData);
			setParties(partiesData);
			setProducts(productsData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch purchases",
			);
		} finally {
			if (showLoader) setFetching(false);
		}
	}, []);

	useEffect(() => {
		const t = window.setTimeout(() => {
			void fetchData();
		}, 0);
		return () => window.clearTimeout(t);
	}, [fetchData]);

	const handleDeleteConfirm = async () => {
		if (!deleteId) return;

		try {
			setDeleteLoading(true);
			setError("");

			await deletePurchase(deleteId);
			setPurchases((prev) => prev.filter((p) => p._id !== deleteId));
			setSuccess("Purchase deleted successfully!");
			setShowDeleteModal(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete purchase",
			);
		} finally {
			setDeleteLoading(false);
			setDeleteId(null);
		}
	};

	if (isLoading || fetching) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<AppNav />

			<main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
						<p className="mt-1 text-sm text-gray-500">
							Record, update, and track purchases by supplier.
						</p>
					</div>

					<button
						onClick={() => {
							setEditData(null);
							setShowModal(true);
						}}
						className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700">
						<PlusIcon className="h-4 w-4" />
						Add Purchase
					</button>
				</div>

				{error && <Alert type="error" message={error} />}
				{success && <Alert type="success" message={success} />}

				<PurchasesTable
					purchases={purchases}
					onEdit={(p) => {
						setEditData(p);
						setShowModal(true);
					}}
					onDelete={(id) => {
						setDeleteId(id);
						setShowDeleteModal(true);
					}}
					showDeleteModal={showDeleteModal}
					setShowDeleteModal={setShowDeleteModal}
					handleDeleteConfirm={handleDeleteConfirm}
					deleteLoading={deleteLoading}
				/>
			</main>

			{showModal && (
				<PurchaseModal
					key={editData?._id ?? "new-purchase"}
					open={showModal}
					onClose={() => setShowModal(false)}
					editData={editData}
					parties={parties}
					products={products}
					onSuccess={(msg) => {
						void fetchData(false);
						setSuccess(msg);
					}}
				/>
			)}
		</div>
	);
}
