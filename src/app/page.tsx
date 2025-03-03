"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4 fade-in"
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to the Prompt Library</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Discover, share, and upvote the best LLM prompts curated by our community.
          Whether you need inspiration or want to showcase your creativity, our platform
          has something for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/prompts"
            className="btn btn-secondary"
          >
            Browse Prompts
          </Link>
          <Link
            href="/auth/signin"
            className="btn btn-primary"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
