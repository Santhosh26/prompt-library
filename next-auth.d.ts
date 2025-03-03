import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // or use your specific type, e.g., 'USER' | 'ADMIN'
    };
  }
  interface User {
    role?: string;
  }
}
