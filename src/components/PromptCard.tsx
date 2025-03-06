"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PromptCardProps {
  id: string;
  title: string;
  content: string;
  useCase: string;
  source: string;
  upvotes: number;
  createdBy?: string;
  userName?: string;
  onUpvote: (id: string) => void;
}

export default function PromptCard({
  id,
  title,
  content,
  useCase,
  source,
  upvotes,
  userName,
  onUpvote,
}: PromptCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    
    onUpvote(id);
  };
  
  const handleTryWithChatGPT = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Encode the prompt text for URL
    const encodedPrompt = encodeURIComponent(content);
    window.open(`https://chat.openai.com/chat?prompt=${encodedPrompt}`, '_blank');
  };
  
  const handleTryWithClaude = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Claude doesn't support direct prompt URLs yet, so we'll open Claude's chat page
    window.open('https://claude.ai/chat', '_blank');
  };
  
  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Truncate content if it's too long
  const truncatedContent = content.length > 120
    ? content.substring(0, 120) + "..."
    : content;

  return (
    <motion.div
      className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold">
          <Link href={`/prompts/${id}`} className="hover:text-blue-600 transition">
            {title}
          </Link>
        </h2>
        <button
          onClick={handleUpvoteClick}
          className={`flex items-center gap-1 px-3 py-1 rounded-full ${
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
          <span>{upvotes}</span>
        </button>
      </div>

      <p className="text-gray-700 mb-4">{truncatedContent}</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleTryWithChatGPT}
          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-xs font-medium transition-colors"
          title="Try this prompt with ChatGPT"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 12l-4 4-4-4"></path>
            <path d="M12 8v7"></path>
          </svg>
          Try with ChatGPT
        </button>
        
        <button
          onClick={handleTryWithClaude}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full text-xs font-medium transition-colors"
          title="Try this prompt with Claude"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 12l-4 4-4-4"></path>
            <path d="M12 8v7"></path>
          </svg>
          Try with Claude
        </button>
        
        <button
          onClick={handleCopyPrompt}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-xs font-medium transition-colors"
          title="Copy prompt to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mt-3">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          {useCase}
        </span>
        <span className="text-gray-500 text-sm">
          By: {userName || "Anonymous"}
        </span>
      </div>
    </motion.div>
  );
}