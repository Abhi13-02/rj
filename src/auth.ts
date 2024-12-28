import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./libs/dbConnect";
import User from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await dbConnect(); // Ensure MongoDB is connected

      try {
        // Check if user already exists
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // If user doesn't exist, create a new user
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        // Attach MongoDB _id to the user object
        user.id = existingUser._id.toString();
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false; // Deny sign-in on error
      }

      return true; // Allow sign-in
    },

    async jwt({ token, user }) {
      // Include MongoDB _id in the token
      if (user) {
        token.id = user.id; // user.id is set during signIn
      }
      return token;
    },

    async session({ session, token }) {
      // Pass MongoDB _id to the session
      if (token) {
        session.user.id = token.id as string; // token.id contains MongoDB _id
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
