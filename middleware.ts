import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/api/auth/signin", // NextAuth will auto-handle callbackUrl
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*", // protect coach dashboard
    // add more protected routes here later if needed
  ],
};
