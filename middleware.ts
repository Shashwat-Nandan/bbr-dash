export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /login
     * - /api/auth (NextAuth routes)
     * - /_next (Next.js internals)
     * - /favicon.ico, /public files
     */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
