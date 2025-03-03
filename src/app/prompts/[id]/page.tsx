"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export interface Prompt {
  id: string;
  title: string;
  content: string;
  useCase: string;
  source: string;
  upvotes: number;
}

export default function PromptDetail() {
  const { id } = useParams();
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/prompts/${id}`)
      .then((res) => res.json())
      .then((data) => setPrompt(data));
  }, [id]);

  if (!prompt) return <div>Loading...</div>;

  return (
    <motion.main
      className="p-8 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
      <p className="mb-4">{prompt.content}</p>
      <p className="mb-2 text-sm text-gray-500">
        Use Case: {prompt.useCase}
      </p>
      <p className="mb-2 text-sm text-gray-500">Source: {prompt.source}</p>
      <p className="mb-2 text-sm text-gray-500">Upvotes: {prompt.upvotes}</p>
    </motion.main>
  );
}
