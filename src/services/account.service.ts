import {
  Account,
  CreateAccountPayload,
  UpdateAccountPayload,
} from "@/types/account";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("accessToken");

export const getAllAccounts = async (): Promise<Account[]> => {
  const res = await fetch(`${BASE_URL}/accounting/accounts`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.accounts;
};

export const getAccountById = async (id: string): Promise<Account> => {
  const res = await fetch(`${BASE_URL}/accounting/accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.account;
};

export const createAccount = async (
  payload: CreateAccountPayload,
): Promise<Account> => {
  const res = await fetch(`${BASE_URL}/accounting/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.account;
};

export const updateAccount = async (
  id: string,
  payload: UpdateAccountPayload,
): Promise<Account> => {
  const res = await fetch(`${BASE_URL}/accounting/accounts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.account;
};

export const deleteAccount = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/accounting/accounts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
};
