export type LedgerType = "sale" | "purchase" | "expense" | "salary";

export interface Ledger {
  _id: string;
  code: string;

  accounts: {
    _id: string;
    ownerName: string;
    bankName?: string;
    bankAccountNo: string;
    type: "bank" | "mobile-account" | "cash";
    balance: number;
  };

  debit: number;
  credit: number;

  party: {
    _id: string;
    name: string;
    email: string;
  };

  type: LedgerType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLedgerPayload {
  code: string;
  accounts: string;
  party: string;
  debit: number;
  credit: number;
  type: LedgerType;
  description?: string;
}

export interface UpdateLedgerPayload {
  code?: string;
  accounts?: string;
  party?: string;
  debit?: number;
  credit?: number;
  type?: LedgerType;
  description?: string;
}
