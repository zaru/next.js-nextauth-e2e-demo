export { auth as middleware } from "./lib/auth";
// import { providers, jwt, jwtBase64 } from "./lib/auth";
// import NextAuth from "next-auth";
// export const { auth: middleware } = NextAuth({ providers, jwt });

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
