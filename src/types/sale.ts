import { Party } from "@/types/party";

export type SaleParty = Pick<
  Party,
  "_id" | "name" | "partyType" | "email" | "phoneNumber" | "address"
>;

export interface Sale {
  _id: string;
  party: SaleParty;
  products: string[];
  date: string;
  quantity: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalePayload {
  party: string;
  products: string[];
  date: string;
  quantity: number;
  amount: number;
}

export interface UpdateSalePayload {
  party?: string;
  products?: string[];
  date?: string;
  quantity?: number;
  amount?: number;
}

export interface SaleFormValues {
  party: string;
  productsText: string;
  date: string;
  quantity: string;
  amount: string;
}
