"use client";

import { Ledger } from "@/types/ledger";

interface Props {
  ledgers: Ledger[];
  onEdit: (ledger: Ledger) => void;
  onDelete: (id: string) => void;
}

export default function LedgerTable({ ledgers = [], onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Code</th>
            <th className="p-3">Account</th>
            <th className="p-3">Party</th>
            <th className="p-3">Debit</th>
            <th className="p-3">Credit</th>
            <th className="p-3">Type</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {ledgers.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-500">
                No ledgers found
              </td>
            </tr>
          ) : (
            ledgers.map((ledger) => (
              <tr key={ledger._id} className="border-t">
                <td className="p-3">{ledger.code}</td>

                <td className="p-3">{ledger.accounts?.ownerName || "N/A"}</td>

                <td className="p-3">{ledger.party?.name || "N/A"}</td>

                <td className="p-3">{ledger.debit}</td>

                <td className="p-3">{ledger.credit}</td>

                <td className="p-3 capitalize">{ledger.type}</td>

                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(ledger)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(ledger._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
