import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function will be called if the user is authenticated.
    // You can add additional authorization logic here if needed.
    // For now, we just let authenticated users pass.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If there is a token, the user is authorized.
        // This means they are signed in.
        return !!token;
      },
    },
    pages: {
      // Redirect unauthenticated users to this page
      signIn: "/api/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/recipes", "/recipes/:id*", "/upload"],
};
