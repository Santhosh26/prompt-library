"use client";

import { useEffect, useState, use } from "react";
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
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
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
  
  const handleTryWithChatGPT = () => {
    if (!prompt) return;
    
    // Encode the prompt text for URL
    const encodedPrompt = encodeURIComponent(prompt.content);
    window.open(`https://chat.openai.com/chat?prompt=${encodedPrompt}`, '_blank');
  };
  
  const handleTryWithClaude = () => {
    // Claude doesn't support direct prompt URLs yet, so we'll open Claude's chat page
    window.open('https://claude.ai/chat', '_blank');
  };
  
  const handleCopyPrompt = () => {
    if (!prompt) return;
    
    navigator.clipboard.writeText(prompt.content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
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
        
        <div className="my-4 p-4 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap relative group">
          {prompt.content}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopyPrompt}
              className="p-1.5 bg-white rounded-md border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
              title="Copy prompt to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          <button
            onClick={handleTryWithChatGPT}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-md font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 12l-4 4-4-4"></path>
              <path d="M12 8v7"></path>
            </svg>
            Try with ChatGPT
          </button>
          
          <button
            onClick={handleTryWithClaude}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 12l-4 4-4-4"></path>
              <path d="M12 8v7"></path>
            </svg>
            Try with Claude
          </button>
          
          <button
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
            {isCopied ? "Copied!" : "Copy to Clipboard"}
          </button>
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