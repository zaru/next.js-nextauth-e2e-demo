import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { type Provider } from "@auth/core/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { JWT, JWTDecodeParams, JWTEncodeParams } from "@auth/core/jwt";

const prisma = new PrismaClient();

export const providers: Provider[] = [GitHub];

if (process.env.APP_ENV === "test") {
  providers.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // 固定のユーザデータをセッションとして返す
        return {
          id: "1",
          name: "dummy user",
          email: "dummy@example.com",
        };
      },
    }),
  );
}

// https://authjs.dev/guides/basics/overriding-jwt
// JWTを独自エンコード・デコード処理に切り替えることで、ログイン済みセッションをE2Eで再現できる
export const jwtTestEnv = {
  async encode(params: JWTEncodeParams<JWT>): Promise<string> {
    return "dummy-jwt-token";
  },
  async decode(params: JWTDecodeParams): Promise<JWT | null> {
    return {
      name: "zaru",
      email: "zarutofu@gmail.com",
      picture: "https://avatars.githubusercontent.com/u/235650?v=4",
      sub: "sub-dummy",
    };
  },
};

export const jwtBase64 = {
  async encode(params: JWTEncodeParams<JWT>): Promise<string> {
    return btoa(JSON.stringify(params.token));
  },
  async decode(params: JWTDecodeParams): Promise<JWT | null> {
    if (!params.token) return {};
    return JSON.parse(atob(params.token));
  },
};

const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  session: {
    // strategy: "database",
    strategy: "jwt",
    maxAge: 86400,
  },
  ...(process.env.APP_ENV === "test" ? { jwt: jwtTestEnv } : {}),
  adapter: PrismaAdapter(prisma),
  providers: providers,
  callbacks: {
    authorized({ request, auth }) {
      console.log("authorized session:", auth);
      const { pathname } = request.nextUrl;
      if (pathname === "/protect") return !!auth;
      return true;
    },
    async jwt({ token, account, profile }) {
      console.log("authorized token:", token);
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
