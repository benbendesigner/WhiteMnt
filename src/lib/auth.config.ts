import type { NextAuthConfig } from "next-auth";

// Lightweight config — no Node.js-only imports (bcrypt, etc.)
// Safe to use in Edge middleware.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        // Already logged in → skip login page
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      // All other /admin/* routes require auth
      return isLoggedIn;
    },
  },
  providers: [],
};
