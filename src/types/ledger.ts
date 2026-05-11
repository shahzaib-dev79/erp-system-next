export type LedgerType = "sale" | "purchase" | "expense" | "salary";

export interface Ledger {
  _id: string;
  code: string;
  accounts: {
    _id: string;
    name: string;
    category: string;
    value: number;
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
  debit: number;
  credit: number;
  party: string;
  type: LedgerType;
  description?: string;
}

export interface UpdateLedgerPayload {
  code?: string;
  accounts?: string;
  debit?: number;
  credit?: number;
  party?: string;
  type?: LedgerType;
  description?: string;
}
