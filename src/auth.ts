import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import dbConnect from "./libs/dbConnect";
import User from "./models/User";

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await dbConnect(); // Ensure MongoDB is connected

      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // If user doesn't exist, create a new user
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false; // Return false to deny sign-in in case of an error
      }

      return true; // Allow sign-in
    },
    async session({ session, token }) {
      // Pass additional user info into the session object if needed
      if (token) {
        session.user.id = token.sub ?? '';      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
})