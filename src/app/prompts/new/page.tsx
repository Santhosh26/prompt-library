"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { PROMPT_USE_CASES } from "@/lib/constants";

export default function NewPromptPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return <NewPromptForm />;
}

function NewPromptForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [useCase, setUseCase] = useState(PROMPT_USE_CASES[0]);
  const [customUseCase, setCustomUseCase] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // If "Other" is selected and custom use case is provided, use that instead
    const finalUseCase = useCase === "Other" && customUseCase.trim() ? customUseCase.trim() : useCase;
    
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, useCase: finalUseCase, source }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      
      setSuccess("Prompt submitted successfully for moderation.");
      
      // Redirect after 3 seconds so the user can see the success message
      setTimeout(() => {
        router.push("/prompts");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <motion.div 
      className="p-8 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit a New Prompt</h1>
        
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Marketing Email Generator"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              className="w-full border border-gray-300 rounded p-2 min-h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="The actual prompt text..."
              required
              rows={6}
            />
          </div>
          
          <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="useCase">
              Use Case
            </label>
            <select
              id="useCase"
              className="w-full border border-gray-300 rounded p-2 input"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              required
            >
              {PROMPT_USE_CASES.map((useCase) => (
                <option key={useCase} value={useCase}>
                  {useCase}
                </option>
              ))}
            </select>
            
            {useCase === "Other" && (
              <div className="mt-2">
                <label className="block font-medium mb-1 text-sm" htmlFor="customUseCase">
                  Specify Custom Use Case
                </label>
                <input
                  id="customUseCase"
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 input"
                  value={customUseCase}
                  onChange={(e) => setCustomUseCase(e.target.value)}
                  placeholder="e.g. Travel Planning"
                  required={useCase === "Other"}
                />
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block font-medium mb-2" htmlFor="source">
              Source / Credits
            </label>
            <input
              id="source"
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. John Doe, ChatGPT, etc."
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Submit Prompt
          </button>
        </form>
      </div>
    </motion.div>
  );
}