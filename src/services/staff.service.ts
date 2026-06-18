import { Staff, CreateStaffPayload, UpdateStaffPayload } from "@/types/staff";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("accessToken");

export const getAllStaff = async (): Promise<Staff[]> => {
  const res = await fetch(`${BASE_URL}/staff`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const getStaffById = async (id: string): Promise<Staff> => {
  const res = await fetch(`${BASE_URL}/staff/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const createStaff = async (
  payload: CreateStaffPayload,
): Promise<Staff> => {
  const res = await fetch(`${BASE_URL}/staff`, {
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

export const updateStaff = async (
  id: string,
  payload: UpdateStaffPayload,
): Promise<Staff> => {
  const res = await fetch(`${BASE_URL}/staff/${id}`, {
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

export const updateStaffStatus = async (
  id: string,
  isActive: boolean,
): Promise<Staff> => {
  const res = await fetch(`${BASE_URL}/staff/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ isActive }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

export const deleteStaff = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/staff/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
};
