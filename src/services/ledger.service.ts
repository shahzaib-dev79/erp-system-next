import {
  Ledger,
  CreateLedgerPayload,
  UpdateLedgerPayload,
} from "@/types/ledger";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("accessToken");

export const getAllLedgers = async (): Promise<Ledger[]> => {
  const res = await fetch(`${BASE_URL}/accounting/ledger`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getLedgerById = async (id: string): Promise<Ledger> => {
  const res = await fetch(`${BASE_URL}/accounting/ledger/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createLedger = async (
  payload: CreateLedgerPayload,
): Promise<Ledger> => {
  const res = await fetch(`${BASE_URL}/accounting/ledger`, {
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

export const updateLedger = async (
  id: string,
  payload: UpdateLedgerPayload,
): Promise<Ledger> => {
  const res = await fetch(`${BASE_URL}/accounting/ledger/${id}`, {
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

export const deleteLedger = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/accounting/ledger/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
};
