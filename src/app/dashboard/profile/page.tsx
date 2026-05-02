"use client";

import { useEffect, useState } from "react";
import AppNav from "@/components/layout/AppNav";
import { Alert, Button, Card, Input, Spinner } from "@/components/ui";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import { users } from "@/lib/api";

export default function ProfilePage() {
  const { isLoading } = useRequireAuth();
  const { user, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, email: user.email });
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);
    try {
      await users.update(user!._id, profileForm);
      await refreshUser();
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setPwLoading(true);
    try {
      await users.changePassword(user!._id, {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
      setPwMsg({ type: "success", text: "Password changed successfully" });
    } catch (err) {
      setPwMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to change password" });
    } finally {
      setPwLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

        {/* Profile */}
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Profile Information</h2>
          {profileMsg && <div className="mb-4"><Alert type={profileMsg.type} message={profileMsg.text} /></div>}
          <form onSubmit={handleProfileSave} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="Email address"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" loading={profileLoading}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Password */}
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
          {pwMsg && <div className="mb-4"><Alert type={pwMsg.type} message={pwMsg.text} /></div>}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current password"
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              required
              autoComplete="current-password"
            />
            <Input
              label="New password"
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
              hint="Minimum 6 characters"
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirm new password"
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              required
              autoComplete="new-password"
            />
            <div className="flex justify-end">
              <Button type="submit" loading={pwLoading}>
                Update password
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
