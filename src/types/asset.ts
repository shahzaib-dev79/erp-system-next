export type AssetCategory = "current" | "fixed" | "intangible";

export interface Asset {
  _id: string;
  name: string;
  category: AssetCategory;
  value: number;
  description?: string;
  purchaseDate?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetPayload {
  name: string;
  category: AssetCategory;
  value: number;
  description?: string;
  purchaseDate?: string;
}

export interface UpdateAssetPayload {
  name?: string;
  category?: AssetCategory;
  value?: number;
  description?: string;
  purchaseDate?: string;
  isActive?: boolean;
}
