import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // afterAuth: (auth, req, evt) => {
  //   console.log('auth:middleware', auth.userId);
  //   console.log('req', req);
  // },
  publicRoutes: ['/', '/api/webhooks/clerk'],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
