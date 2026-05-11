export type PartyType = "customer" | "supplier" | "both" | "staff";

export interface Party {
  _id: string;
  name: string;
  partyType: PartyType;
  email?: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartyPayload {
  name: string;
  partyType: PartyType;
  email?: string;
  phoneNumber: string;
  address: string;
}

export interface UpdatePartyPayload {
  name?: string;
  partyType?: PartyType;
  email?: string;
  phoneNumber?: string;
  address?: string;
}
