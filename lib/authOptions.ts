import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleOAuth from "next-auth/providers/google";
import CredentialProvicer from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
// adding auth providers and db logic here
export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    GoogleOAuth({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialProvicer({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // validate the loggedin user with password hash from db
        const { email, password } = credentials!;
        const user = await prisma.users.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          return null;
        }
        // compare plain pass with hash in db
        const result = await bcrypt.compare(password, user.password);
        return result ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
