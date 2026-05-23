import { Party } from "@/types/party";
import { Product } from "@/types/product";

export interface PurchaseItem {
	product: Pick<Product, "_id" | "name">;
	quantity: number;
	price: number;
	subPrice: number;
}

export interface Purchase {
	_id: string;
	purchaseCode: string;
	supplier: Pick<Party, "_id" | "name" | "email" | "phoneNumber" | "address">;
	items: PurchaseItem[];
	totalAmount: number;
	paidAmount: number;
	dueAmount: number;
	paymentMethod?: string;
	paymentStatus?: string;
	purchaseDate: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreatePurchasePayload {
	purchaseCode: string;
	supplier: string;
	items: {
		product: string;
		quantity: number;
		price: number;
		subPrice: number;
	}[];
	totalAmount: number;
	paidAmount?: number;
	dueAmount?: number;
	paymentMethod?: string;
	paymentStatus?: string;
	purchaseDate?: string;
	notes?: string;
}

export interface UpdatePurchasePayload {
	purchaseCode?: string;
	supplier?: string;
	items?: {
		product: string;
		quantity: number;
		price: number;
		subPrice: number;
	}[];
	totalAmount?: number;
	paidAmount?: number;
	dueAmount?: number;
	paymentMethod?: string;
	paymentStatus?: string;
	purchaseDate?: string;
	notes?: string;
}
