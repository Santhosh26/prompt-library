"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PromptDetail {
  id: string;
  title: string;
  content: string;
  useCase: string;
  source: string;
  upvotes: number;
  status: string;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  };
}

export default function PromptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/prompts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch prompt");
        return res.json();
      })
      .then((data) => {
        setPrompt(data);
      })
      .catch((err) => {
        setError("Error loading prompt");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleUpvote = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const res = await fetch(`/api/prompts/${id}/upvote`, {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Failed to upvote");
      
      const updatedPrompt = await res.json();
      setPrompt(prev => prev ? { ...prev, upvotes: updatedPrompt.upvotes } : null);
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!prompt) return <div className="p-8">Prompt not found</div>;

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <Link href="/prompts" className="text-blue-500 mb-4 inline-block">
        &larr; Back to Prompts
      </Link>
      
      <motion.div
        className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
          <button
            onClick={handleUpvote}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="m19 14-7-7-7 7"></path>
            </svg>
            <span>{prompt.upvotes}</span>
          </button>
        </div>
        
        <div className="my-4 p-4 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
          {prompt.content}
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Use Case:</strong> {prompt.useCase}</p>
          <p><strong>Source:</strong> {prompt.source}</p>
          <p><strong>Submitted by:</strong> {prompt.user?.name || prompt.user?.email || "Anonymous"}</p>
          <p><strong>Date:</strong> {new Date(prompt.createdAt).toLocaleString()}</p>
        </div>
      </motion.div>
    </main>
  );
}