export type AccountType = "bank" | "mobile account" | "cash";

export interface Account {
  _id: string;
  ownerName: string;
  bankName?: string;
  bankAccountNo: string;
  type: AccountType;
  balance: number;
}

export interface CreateAccountPayload {
  ownerName: string;
  bankName?: string;
  bankAccountNo: string;
  type: AccountType;
  balance: number;
}

export interface UpdateAccountPayload {
  ownerName?: string;
  bankName?: string;
  bankAccountNo?: string;
  type?: AccountType;
  balance?: number;
}
