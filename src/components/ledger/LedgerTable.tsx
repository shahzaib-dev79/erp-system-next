"use client";

import { Card } from "@/components/ui";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Ledger } from "@/types/ledger";

interface Props {
  ledgers: Ledger[];
  onEdit: (ledger: Ledger) => void;
  onDelete: (id: string) => void;
}

export default function LedgerTable({ ledgers = [], onEdit, onDelete }: Props) {
  return (
    <Card>
      <div className="border-b border-gray-100 p-4">
        <h2 className="font-semibold text-gray-900">All Ledgers ({ledgers.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Debit</th>
              <th className="px-4 py-3">Credit</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {ledgers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No ledgers found.
                </td>
              </tr>
            ) : (
              ledgers.map((ledger) => (
                <tr key={ledger._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{ledger.code}</td>
                  <td className="px-4 py-3">{ledger.accounts?.ownerName || "N/A"}</td>
                  <td className="px-4 py-3">{ledger.party?.name || "N/A"}</td>
                  <td className="px-4 py-3">{ledger.debit}</td>
                  <td className="px-4 py-3">{ledger.credit}</td>
                  <td className="px-4 py-3 capitalize">{ledger.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(ledger)}
                        className="rounded-md bg-violet-50 p-1.5 text-violet-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(ledger._id)}
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
