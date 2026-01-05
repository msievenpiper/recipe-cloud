import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const locales = ['en', 'es'];
const publicPages = [
  '/',
  '/pricing',
  '/register',
  '/signin',
  '/terms',
  '/privacy',
  '/api/auth/signin',
  '/api/auth/register'
];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en'
});

const authMiddleware = withAuth(
  // Note: If you use withAuth, the middleware function is only called if authorized returns true.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/signin'
    }
  }
);

export default function middleware(req: NextRequest) {
  // Check if public page
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages.join('|')})?/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req); // Just run intl middleware
  } else {
    return (authMiddleware as any)(req); // Run auth middleware (which then calls intlMiddleware on success)
  }
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
