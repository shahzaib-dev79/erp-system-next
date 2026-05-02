"use client";

import { useCallback, useEffect, useState } from "react";
import AppNav from "@/components/layout/AppNav";
import {
  Alert,
  Badge,
  Button,
  Card,
  RoleBadge,
  Spinner,
  StatusBadge,
} from "@/components/ui";
import { useRequireRole } from "@/lib/auth-context";
import { users } from "@/lib/api";
import { Role, User, UserStatsResponse } from "@/types";

export default function AdminPage() {
  const { isLoading } = useRequireRole("admin");
  const [userList, setUserList] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [fetching, setFetching] = useState(true);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        users.getAll(),
        users.getStats(),
      ]);
      setUserList(usersRes.users);
      setStats(statsRes.stats);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoleChange = async (id: string, role: Role) => {
    setActionError(""); setActionSuccess("");
    try {
      await users.updateRole(id, { role });
      setUserList((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      setActionSuccess("Role updated successfully");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleStatusToggle = async (id: string, current: boolean) => {
    setActionError(""); setActionSuccess("");
    try {
      await users.updateStatus(id, { isActive: !current });
      setUserList((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !current } : u))
      );
      setActionSuccess(`User ${!current ? "activated" : "deactivated"}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setDeletingId(id); setActionError(""); setActionSuccess("");
    try {
      await users.delete(id);
      setUserList((prev) => prev.filter((u) => u._id !== id));
      setActionSuccess("User deleted");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage users, roles, and account status</p>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchData}>
            Refresh
          </Button>
        </div>

        {/* Feedback */}
        {actionError && <Alert type="error" message={actionError} />}
        {actionSuccess && <Alert type="success" message={actionSuccess} />}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={stats.total} color="violet" />
            <StatCard label="Active" value={stats.active} color="green" />
            <StatCard label="Inactive" value={stats.inactive} color="red" />
            <StatCard label="Admins" value={stats.byRole?.admin ?? 0} color="amber" />
          </div>
        )}

        {/* Users Table */}
        <Card>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">All Users</h2>
            <Badge variant="default">{userList.length} total</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">User</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Joined</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {userList.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value as Role)}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge isActive={u.isActive} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant={u.isActive ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => handleStatusToggle(u._id, u.isActive)}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={deletingId === u._id}
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "violet" | "green" | "red" | "amber";
}) {
  const colors = {
    violet: "text-violet-700 bg-violet-50 border-violet-100",
    green: "text-green-700 bg-green-50 border-green-100",
    red: "text-red-700 bg-red-50 border-red-100",
    amber: "text-amber-700 bg-amber-50 border-amber-100",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
    </div>
  );
}
