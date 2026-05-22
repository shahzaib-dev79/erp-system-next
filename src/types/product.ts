export interface SellerGroup {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  sellerGroup: SellerGroup;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  quantity: number;
  description: string;
  sellerGroup: string;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  quantity?: number;
  description?: string;
  sellerGroup?: string;
}
