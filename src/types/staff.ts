export type Department = "sales" | "accounts" | "hr" | "stock";

export type Position =
  | "manager"
  | "salesman"
  | "accountant"
  | "stock incharge"
  | "hr officer";

export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  position: Position;
  salary: number;
  joiningDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone: string;
  department: Department;
  position: Position;
  salary: number;
  joiningDate: string;
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  phone?: string;
  department?: Department;
  position?: Position;
  salary?: number;
  joiningDate?: string;
  isActive?: boolean;
}
