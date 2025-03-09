// File: src/app/prompts/page.tsx
// Updated to use icon components

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PROMPT_USE_CASES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { 
  HeartFilledIcon, 
  HeartOutlineIcon, 
  EditIcon, 
  DeleteIcon 
} from "@/components/icons/Icons";

export interface Prompt {
  id: string;
  title: string;
  content: string;
  useCase: string;
  source: string;
  upvotes: number;
  status: string;
  createdAt: string;
  createdBy?: string;
  user?: {
    name: string | null;
    email: string;
  };
  liked?: boolean;
}

export default function PromptsPage() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showMyPrompts, setShowMyPrompts] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch approved prompts on mount
  useEffect(() => {
    fetchPrompts();
  }, [showMyPrompts, session]);

  const fetchPrompts = async () => {
    try {
      const url = showMyPrompts && session?.user?.id 
        ? `/api/prompts?createdBy=${session.user.id}` 
        : "/api/prompts";
      
      const res = await fetch(url);
      const data = await res.json();
      
      // Filter approved prompts if not showing user's prompts
      const filteredPrompts = showMyPrompts 
        ? data 
        : data.filter((p: Prompt) => p.status === "APPROVED");
      
      setPrompts(filteredPrompts);
    } catch (err) {
      console.error("Error fetching prompts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique use case options from prompts and predefined list
  const uniqueUseCases = ["All", ...new Set([
    ...PROMPT_USE_CASES,
    ...prompts.map(p => p.useCase).filter(useCase => 
      useCase && !PROMPT_USE_CASES.includes(useCase as any)
    )
  ])];

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
      router.push("/auth/signin");
      return;
    }

    try {
      const res = await fetch(`/api/prompts/${id}/upvote`, {
        method: "POST",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process upvote");
      }
      
      const updatedPrompt = await res.json();
      
      // Update the prompt in the state
      setPrompts(prevPrompts => 
        prevPrompts.map(p => 
          p.id === id ? { ...p, upvotes: updatedPrompt.upvotes, liked: updatedPrompt.liked } : p
        )
      );
    } catch (err) {
      console.error("Error handling upvote:", err);
      // Show error only in console, not to the user for better UX
    }
  };

  const handleEditPrompt = (id: string) => {
    router.push(`/prompts/edit/${id}`);
  };

  const handleDeleteConfirm = (id: string) => {
    setPromptToDelete(id);
    setIsDeleting(true);
  };

  const handleDeletePrompt = async () => {
    if (!promptToDelete) return;

    try {
      const res = await fetch(`/api/prompts/${promptToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete prompt");
      }

      // Remove the deleted prompt from the list
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptToDelete));
      
      // Reset state
      setIsDeleting(false);
      setPromptToDelete(null);
    } catch (err) {
      console.error("Error deleting prompt:", err);
      setError(err instanceof Error ? err.message : "Failed to delete prompt");
      // Don't close the modal on error so the user can see the error message
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setPromptToDelete(null);
    setError("");
  };

  const toggleMyPrompts = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setShowMyPrompts(!showMyPrompts);
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
          <h1 className="text-2xl font-bold">
            {showMyPrompts ? "My Prompts" : "Prompt Library"}
          </h1>
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
              {uniqueUseCases.map((useCase) => (
                <option key={useCase} value={useCase}>
                  {useCase}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {session && (
            <button
              onClick={toggleMyPrompts}
              className={`px-4 py-2 rounded transition ${
                showMyPrompts 
                  ? "bg-blue-100 text-blue-700 border border-blue-300" 
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {showMyPrompts ? "Viewing My Prompts" : "View My Prompts"}
            </button>
          )}
          
          <Link
            href="/prompts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit New Prompt
          </Link>
        </div>

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
                  <div className="flex items-center">
                    {session?.user?.id === prompt.createdBy && (
                      <div className="flex mr-2">
                        <button
                          onClick={() => handleEditPrompt(prompt.id)}
                          className="p-1 text-gray-500 hover:text-blue-500 mr-1"
                          title="Edit prompt"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(prompt.id)}
                          className="p-1 text-gray-500 hover:text-red-500"
                          title="Delete prompt"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={(e) => handleUpvote(prompt.id, e)}
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        !session 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : prompt.liked
                            ? "bg-red-100 text-red-600 hover:bg-red-50"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }`}
                      disabled={!session}
                      title={session ? "Like this prompt" : "Sign in to like"}
                    >
                      {prompt.liked ? <HeartFilledIcon width={16} height={16} /> : <HeartOutlineIcon width={16} height={16} />}
                      <span>{prompt.upvotes}</span>
                    </button>
                  </div>
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
                  {prompt.status !== "APPROVED" && (
                    <span className={`${
                      prompt.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    } px-2 py-1 rounded-full text-xs`}>
                      {prompt.status}
                    </span>
                  )}
                  <span className="text-gray-500">
                    By: {prompt.user?.name || "Anonymous"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            
            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <p className="mb-6">Are you sure you want to delete this prompt? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePrompt}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}