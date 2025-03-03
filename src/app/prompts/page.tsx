"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export interface Prompt {
  id: string;
  title: string;
  content: string;
  useCase: string;
  source: string;
  upvotes: number;
  status: string;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/prompts")
      .then((res) => res.json())
      .then((data) => {
        // Filter for only approved prompts
        const approvedPrompts = data.filter(
          (p: Prompt) => p.status === "APPROVED"
        );
        setPrompts(approvedPrompts);
      });
  }, []);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(search.toLowerCase()) ||
    prompt.useCase.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prompt Library</h1>
        <input
          type="text"
          placeholder="Search prompts..."
          className="border border-gray-300 p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {filteredPrompts.map((prompt) => (
          <motion.div
            key={prompt.id}
            className="bg-white p-4 rounded shadow"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/prompts/${prompt.id}`}>{prompt.title}</Link>
            </h2>
            <p className="text-gray-600">
              {prompt.content.substring(0, 100)}...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Use Case: {prompt.useCase}
            </p>
            <p className="text-sm text-gray-500">Source: {prompt.source}</p>
            <p className="text-sm text-gray-500 mt-2">
              Upvotes: {prompt.upvotes}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
