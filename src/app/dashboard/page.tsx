"use client";

import { useEffect, useState } from "react";
import AppNav from "@/components/layout/AppNav";
import { Badge, Card, RoleBadge, Spinner, StatusBadge } from "@/components/ui";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import { users } from "@/lib/api";
import { User } from "@/types";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;

    users
      .getById(user._id)
      .then((res) => setProfile(res.data?.user ?? null))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!user) {
    return null;
  }
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const u = profile || user;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {u?.name}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's your account overview.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" value={u?.name} />
            <Field label="Email" value={u?.email} />
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Role</p>
              {u && <RoleBadge role={u.role} />}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
              {u && <StatusBadge isActive={u.isActive} />}
            </div>
            <Field
              label="Member since"
              value={
                u?.createdAt
                  ? new Date(u.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"
              }
            />
            <Field
              label="Last updated"
              value={
                u?.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "—"
              }
            />
          </div>
        </Card>

        {/* Permissions */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Permissions
          </h2>
          <div className="space-y-2">
            {getPermissions(u?.role).map((perm) => (
              <div key={perm.label} className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${perm.granted ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-sm text-gray-700">{perm.label}</span>
                {!perm.granted && (
                  <Badge variant="default">
                    <span className="text-xs">Requires {perm.requires}</span>
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900">{value || "—"}</p>
    </div>
  );
}

function getPermissions(role?: string) {
  return [
    { label: "View own profile", granted: true, requires: "" },
    { label: "Update own profile", granted: true, requires: "" },
    { label: "Change own password", granted: true, requires: "" },
    { label: "View all users", granted: role === "admin", requires: "admin" },
    {
      label: "Update user roles",
      granted: role === "admin",
      requires: "admin",
    },
    { label: "Deactivate users", granted: role === "admin", requires: "admin" },
    { label: "Delete users", granted: role === "admin", requires: "admin" },
    { label: "View user stats", granted: role === "admin", requires: "admin" },
    {
      label: "Moderate content",
      granted: role === "admin" || role === "moderator",
      requires: "moderator",
    },
  ];
}
