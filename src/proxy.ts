import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/admin", "/profile"];

// Routes that require admin role (mirrors authorize("admin") middleware)
const ADMIN_ROUTES = ["/admin"];

// Routes that should redirect authenticated users away
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Read tokens from cookies (set server-side) or headers
	const accessToken = request.cookies.get("accessToken")?.value;
	const userRole = request.cookies.get("userRole")?.value;

	const isAuthenticated = !!accessToken;

	// ── Redirect authenticated users away from login/register ─────────────────
	if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && isAuthenticated) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// ── Protect authenticated routes (mirrors authenticate middleware) ─────────
	if (
		PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) &&
		!isAuthenticated
	) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// ── Admin-only routes (mirrors authorize("admin") middleware) ─────────────
	if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
		if (!isAuthenticated) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (userRole !== "admin") {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
