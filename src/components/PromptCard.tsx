"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    
    onUpvote(id);
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