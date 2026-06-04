"use client";

import AppNav from "@/components/layout/AppNav";
import PurchaseForm from "@/components/purchase/PurchaseForm";
import { createLedger } from "@/services/ledger.service";
import { useRouter } from "next/navigation";
import { CreateLedgerPayload } from "@/types/ledger";
import { useState, useEffect } from "react";
import { getAllAccounts } from "@/services/account.service";
import { getAllParties } from "@/services/party.services";
// Assuming you have these types defined somewhere, import them:
import { AccountType } from "@/types/account";
import { PartyType } from "@/types/party";

export default function CreateLedgerPage() {
	const router = useRouter();

	// 1. Fixed: Explicitly typed states
	const [accounts, setAccounts] = useState<AccountType[]>([]);
	const [parties, setParties] = useState<PartyType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [submitError, setSubmitError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				// Running them in parallel speeds up page load
				const [acc, party] = await Promise.all([
					getAllAccounts(),
					getAllParties(),
				]);

				setAccounts(acc);
				setParties(party);
			} catch (error) {
				console.error("Failed to load form data:", error);
				// Optionally handle page-wide error state here
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	const handleSubmit = async (data: CreateLedgerPayload) => {
		try {
			setSubmitError(null);
			await createLedger(data);
			router.push("/dashboard/purchase");
		} catch (error) {
			console.error("Submission failed:", error);
			setSubmitError("Failed to create purchase. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<AppNav />

			<main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
				<div className="w-full max-w-2xl bg-white shadow-sm p-8">
					<h1 className="text-2xl font-bold mb-6 text-center">
						Create Purchase
					</h1>

					{submitError && (
						<div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">
							{submitError}
						</div>
					)}

					{isLoading ? (
						<div className="text-center py-10 text-gray-500">
							Loading form options...
						</div>
					) : (
						<PurchaseForm
							onSubmit={handleSubmit}
							accounts={accounts}
							parties={parties}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
