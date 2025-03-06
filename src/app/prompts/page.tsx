"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export interface Prompt {
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

export default function PromptsPage() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch approved prompts on mount
  useEffect(() => {
    fetch("/api/prompts")
      .then((res) => res.json())
      .then((data) => {
        const approvedPrompts = data.filter(
          (p: Prompt) => p.status === "APPROVED"
        );
        setPrompts(approvedPrompts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching prompts:", err);
        setLoading(false);
      });
  }, []);

  // Get unique use case options from prompts
  const uniqueUseCases = Array.from(new Set(prompts.map((p) => p.useCase)));

  // Filter prompts based on search text and selected use case
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(search.toLowerCase()) ||
      prompt.content.toLowerCase().includes(search.toLowerCase()) ||
      prompt.useCase.toLowerCase().includes(search.toLowerCase());
    const matchesUseCase =
      selectedUseCase === "All" || prompt.useCase === selectedUseCase;
    return matchesSearch && matchesUseCase;
  });

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      return;
    }

    try {
      const res = await fetch(`/api/prompts/${id}/upvote`, {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Failed to upvote");
      
      const updatedPrompt = await res.json();
      
      setPrompts(prevPrompts => 
        prevPrompts.map(p => 
          p.id === id ? { ...p, upvotes: updatedPrompt.upvotes } : p
        )
      );
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Prompt Library</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search prompts..."
              className="border border-gray-300 p-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={selectedUseCase}
              onChange={(e) => setSelectedUseCase(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="All">All Use Cases</option>
              {uniqueUseCases.map((useCase) => (
                <option key={useCase} value={useCase}>
                  {useCase}
                </option>
              ))}
            </select>
          </div>
        </div>

        {session && (
          <div className="mb-6">
            <Link
              href="/prompts/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit New Prompt
            </Link>
          </div>
        )}

        {filteredPrompts.length === 0 ? (
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p>No prompts found matching your criteria.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              },
            }}
          >
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                className="bg-white p-4 rounded shadow transition-shadow hover:shadow-md"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link href={`/prompts/${prompt.id}`} className="hover:text-blue-600 transition">
                      {prompt.title}
                    </Link>
                  </h2>
                  <button
                    onClick={(e) => handleUpvote(prompt.id, e)}
                    className={`ml-2 flex items-center gap-1 px-2 py-1 rounded ${
                      session 
                        ? "bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!session}
                    title={session ? "Upvote this prompt" : "Sign in to upvote"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m19 14-7-7-7 7"></path>
                    </svg>
                    <span>{prompt.upvotes}</span>
                  </button>
                </div>

                <p className="text-gray-600 mb-3">
                  {prompt.content.length > 100
                    ? prompt.content.substring(0, 100) + "..."
                    : prompt.content}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {prompt.useCase}
                  </span>
                  <span className="text-gray-500">
                    By: {prompt.user?.name || "Anonymous"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}