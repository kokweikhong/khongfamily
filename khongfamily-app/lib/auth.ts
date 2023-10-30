import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: any) {
  console.log("REFRESH TOKEN");
  console.log(token);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      body: JSON.stringify(token),
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!res.ok) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  const authUser = await res.json();

  // console.log("REFRESH TOKEN AUTH USER")
  // console.log(authUser)

  return {
    ...token,
    accessToken: authUser.accessToken,
    accessTokenExpiry: authUser.accessTokenExpiry,
  };
}

console.log("auth.ts: line 35");
console.log(process.env.NEXT_PUBLIC_API_URL);

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log(credentials);
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/users/signin`);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/signin`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          },
        );
        console.log(res);
        const user = await res.json();
        // console.log(user)
        // const user = { id: 1, name: "J Smith", email: "jsm@gmail.com" }
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      token = { ...token, ...user };
      // console.log("JWT")
      // console.log(token)
      console.log(Date.now() - 5000);
      console.log((token.accessTokenExpiry as unknown as number) * 1000);
      if (
        Date.now() - 5000 <
        (token.accessTokenExpiry as unknown as number) * 1000
      ) {
        return token;
      } else {
        const newToken = await refreshAccessToken(token);
        return { ...newToken };
      }
    },
    async session({ session, token, user }) {
      session.user = token as any;
      // console.log("SESSION")
      // console.log(session)
      return session;
    },
  },
};
