"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button, RoleBadge } from "@/components/ui";

export default function AppNav() {
	const { user, logout } = useAuth();
	const pathname = usePathname();
	const router = useRouter();

	const navItems = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/dashboard/assets", label: "Assets" },
		{ href: "/dashboard/accounts", label: "Accounts" },
		{ href: "/dashboard/parties", label: "Parties" },
		{ href: "/dashboard/sales", label: "Sales" },
		{ href: "/dashboard/purchase", label: "Purchases" },
		{ href: "/dashboard/ledger", label: "Ledger" },
		{ href: "/dashboard/products", label: "Products" },
		...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
		{ href: `/dashboard/profile`, label: "Profile" },
	];

	console.log("AppNav rendered - user:", user, "role:", user?.role);

	return (
		<nav className="bg-white border-b border-gray-200 px-4 sm:px-6">
			<div className="max-w-7xl mx-auto flex items-center justify-between h-14">
				{/* Logo */}
				<button
					type="button"
					onClick={() => router.push("/dashboard")}
					className="font-bold text-violet-700 text-lg tracking-tight cursor-pointer hover:opacity-80">
					AuthApp
				</button>

				{/* Nav links */}
				<div className="hidden sm:flex items-center gap-1">
					{navItems.map((item) => (
						<button
							type="button"
							key={item.href}
							onClick={() => {
								console.log("Navigating to:", item.href);
								router.push(item.href);
							}}
							className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
								pathname === item.href
									? "bg-violet-50 text-violet-700"
									: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							}`}>
							{item.label}
						</button>
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
