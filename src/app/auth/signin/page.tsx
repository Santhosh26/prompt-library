// src/app/auth/signup/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/prompts", // Ensure this is the correct redirect after login
      });

      if (!res) {
        throw new Error("Sign-in failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Email</label>
          <input
            className="border border-gray-300 p-2 rounded w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Password</label>
          <input
            className="border border-gray-300 p-2 rounded w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" type="submit">
          Sign In
        </button>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            Sign up here. It's free.
          </Link>
        </p>
      </form>
    </main>
  );
}
