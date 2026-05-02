"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button, RoleBadge } from "@/components/ui";

export default function AppNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
    { href: `/dashboard/profile`, label: "Profile" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/dashboard" className="font-bold text-violet-700 text-lg tracking-tight">
          AuthApp
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User area */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-600">{user.name}</span>
              <RoleBadge role={user.role} />
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
