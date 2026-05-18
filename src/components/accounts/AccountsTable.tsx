"use client";

import { Account } from "@/types/account";

interface Props {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export default function AccountsTable({ accounts, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Owner</th>
            <th className="p-3">Account No</th>
            <th className="p-3">Type</th>
            <th className="p-3">Balance</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((acc) => (
            <tr key={acc._id} className="border-t">
              <td className="p-3">{acc.ownerName}</td>
              <td className="p-3">{acc.bankAccountNo}</td>
              <td className="p-3">{acc.type}</td>
              <td className="p-3">{acc.balance}</td>

              <td className="p-3 text-right space-x-2">
                <button
                  onClick={() => onEdit(acc)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(acc._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
