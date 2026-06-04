"use client";

import { Card } from "@/components/ui";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Account } from "@/types/account";

interface Props {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export default function AccountsTable({ accounts, onEdit, onDelete }: Props) {
  return (
    <Card>
      <div className="border-b border-gray-100 p-4">
        <h2 className="font-semibold text-gray-900">
          All Accounts ({accounts.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left">
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Account No</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No accounts found.
                </td>
              </tr>
            ) : (
              accounts.map((acc) => (
                <tr key={acc._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {acc.ownerName}
                  </td>
                  <td className="px-4 py-3">{acc.bankAccountNo}</td>
                  <td className="px-4 py-3 capitalize">{acc.type}</td>
                  <td className="px-4 py-3">{acc.balance}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(acc)}
                        className="rounded-md bg-violet-50 p-1.5 text-violet-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(acc._id)}
                        className="rounded-md bg-red-50 p-1.5 text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
