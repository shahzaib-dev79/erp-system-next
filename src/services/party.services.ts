import { Party, CreatePartyPayload, UpdatePartyPayload } from "@/types/party";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("accessToken");

export const getAllParties = async (): Promise<Party[]> => {
  const res = await fetch(`${BASE_URL}/accounting/parties`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.parties;
};

export const getPartyById = async (id: string): Promise<Party> => {
  const res = await fetch(`${BASE_URL}/accounting/parties/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.party;
};

export const createParty = async (
  payload: CreatePartyPayload,
): Promise<Party> => {
  const res = await fetch(`${BASE_URL}/accounting/parties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.party;
};

export const updateParty = async (
  id: string,
  payload: UpdatePartyPayload,
): Promise<Party> => {
  const res = await fetch(`${BASE_URL}/accounting/parties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
  return data.party;
};

export const deleteParty = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/accounting/parties/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.msg);
};
