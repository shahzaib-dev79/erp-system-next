import { CreateSalePayload, Sale, UpdateSalePayload } from "@/types/sale";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("accessToken");

export const getAllSales = async (): Promise<Sale[]> => {
	const res = await fetch(`${BASE_URL}/accounting/sales/getAllSales`, {
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	const data = await res.json();
	if (!data.success) throw new Error(data.message);
	return data.data;
};

export const getSaleById = async (id: string): Promise<Sale> => {
	const res = await fetch(`${BASE_URL}/accounting/sales/getSingleSale/${id}`, {
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	const data = await res.json();
	if (!data.success) throw new Error(data.message);
	return data.data;
};

export const createSale = async (payload: CreateSalePayload): Promise<Sale> => {
	const res = await fetch(`${BASE_URL}/accounting/sales/createSales`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!data.success) throw new Error(data.message);
	return data.data;
};

export const updateSale = async (
	id: string,
	payload: UpdateSalePayload,
): Promise<Sale> => {
	const res = await fetch(`${BASE_URL}/accounting/sales/updateSale/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`,
		},
		body: JSON.stringify(payload),
	});
	const data = await res.json();
	if (!data.success) throw new Error(data.message);
	return data.data;
};

export const deleteSale = async (id: string): Promise<void> => {
	const res = await fetch(`${BASE_URL}/accounting/sales/deleteSale/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${getToken()}`,
		},
	});
	const data = await res.json();
	if (!data.success) throw new Error(data.message);
};
