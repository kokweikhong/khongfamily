import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      // credentials: {
      //   email: { label: "email", type: "text", placeholder: "jsmith" },
      //   password: { label: "Password", type: "password" }
      // },
      async authorize(credentials, req) {
        const { id, email, password, username } = credentials as {
          id: string;
          email: string;
          password: string;
          username: string;
        }
        console.log(email, password)
        const user = { id: id, email: email, password: password, name: username }
        return user
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  secret: process.env.NEXTAUTH_SECRET,

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
})

export { handler as GET, handler as POST }



