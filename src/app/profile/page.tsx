"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Prompt {
  id: string;
  title: string;
  content: string;
  useCase: string;
  source: string;
  upvotes: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/prompts?createdBy=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setPrompts(data));
    }
  }, [session]);

  if (!session) return <p>Please sign in to view your profile.</p>;

  return (
    <motion.div
      className="p-8 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <p className="mb-4">Welcome, {session.user?.name || session.user.email}</p>
      <h2 className="text-2xl font-semibold mb-2">My Submissions</h2>
      {prompts.length === 0 ? (
        <p>You haven&apos;t submitted any prompts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prompts.map((prompt) => (
            <motion.div
              key={prompt.id}
              className="bg-white p-4 rounded shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold">{prompt.title}</h3>
              <p className="text-gray-600">{prompt.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
