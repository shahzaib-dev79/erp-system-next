"use client";

import AppNav from "@/components/layout/AppNav";
import SaleForm from "@/components/sale/SaleForm";
import { createLedger } from "@/services/ledger.service";
import { useRouter } from "next/navigation";
import { CreateLedgerPayload } from "@/types/ledger";
import { useState } from "react";
import { getAllAccounts } from "@/services/account.service";
import { getAllParties } from "@/services/party.services";
import { useEffect } from "react";

export default function CreateLedgerPage() {
	const router = useRouter();

	const [accounts, setAccounts] = useState([]);
	const [parties, setParties] = useState([]);

	useEffect(() => {
		const load = async () => {
			const acc = await getAllAccounts();
			const party = await getAllParties();

			setAccounts(acc);
			setParties(party);
		};

		load();
	}, []);

	const handleSubmit = async (data: CreateLedgerPayload) => {
		try {
			await createLedger(data);
			router.push("/dashboard/sales");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<AppNav />

			<main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
				<div className="w-full max-w-2xl bg-white shadow-sm p-8">
					<h1 className="text-2xl font-bold mb-6 text-center">Create Sales</h1>

					<SaleForm
						onSubmit={handleSubmit}
						accounts={accounts}
						parties={parties}
					/>
				</div>
			</main>
		</div>
	);
}
