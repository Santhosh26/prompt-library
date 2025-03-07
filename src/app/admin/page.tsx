"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

interface Prompt {
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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin once session is loaded
    if (status === "authenticated") {
      if (!session || session.user?.role !== "ADMIN") {
        redirect("/");
      } else {
        // Fetch pending prompts
        fetch("/api/prompts")
          .then((res) => res.json())
          .then((data) => {
            const pendingPrompts = data.filter(
              (p: Prompt) => p.status === "PENDING"
            );
            setPrompts(pendingPrompts);
            setLoading(false);
          })
          .catch(err => {
            console.error("Error fetching prompts:", err);
            setLoading(false);
          });
      }
    }
  }, [session, status]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}/approve`, {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Failed to approve prompt");
      
      // Remove the prompt from the list
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error approving prompt:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/prompts/${id}/reject`, {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Failed to reject prompt");
      
      // Remove the prompt from the list
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error rejecting prompt:", err);
    }
  };

  // Show loading state while session check happens
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pending Prompts</h2>
          {prompts.length === 0 ? (
            <p className="text-gray-500">No pending prompts to review</p>
          ) : (
            <div className="space-y-6">
              {prompts.map((prompt) => (
                <motion.div 
                  key={prompt.id} 
                  className="border border-gray-200 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-lg font-medium mb-2">{prompt.title}</h3>
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{prompt.content}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {prompt.useCase}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                      Source: {prompt.source}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Submitted by: {prompt.user?.name || prompt.user?.email || "Anonymous"} on{" "}
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(prompt.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(prompt.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}