import {
	CreatePurchasePayload,
	Purchase,
	UpdatePurchasePayload,
} from "@/types/purchase";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("accessToken");

export const getAllPurchases = async (): Promise<Purchase[]> => {
	const res = await fetch(`${BASE_URL}/accounting/purchase`, {
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	const data = await res.json();
	if (!data.success)
		throw new Error(data.message || "Failed to fetch purchases");
	return data.data;
};

export const getPurchaseById = async (id: string): Promise<Purchase> => {
	const res = await fetch(`${BASE_URL}/accounting/purchase/${id}`, {
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	const data = await res.json();
	if (!data.success)
		throw new Error(data.message || "Failed to fetch purchase");
	return data.data;
};

export const createPurchase = async (
	payload: CreatePurchasePayload,
): Promise<Purchase> => {
	const res = await fetch(`${BASE_URL}/accounting/purchase`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!data.success)
		throw new Error(data.message || "Failed to create purchase");
	return data.data;
};

export const updatePurchase = async (
	id: string,
	payload: UpdatePurchasePayload,
): Promise<Purchase> => {
	const res = await fetch(`${BASE_URL}/accounting/purchase/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!data.success)
		throw new Error(data.message || "Failed to update purchase");
	return data.data;
};

export const deletePurchase = async (id: string): Promise<void> => {
	const res = await fetch(`${BASE_URL}/accounting/purchase/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	const data = await res.json();
	if (!data.success)
		throw new Error(data.message || "Failed to delete purchase");
};
