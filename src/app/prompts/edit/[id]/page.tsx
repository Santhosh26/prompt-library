// File: src/app/prompts/edit/[id]/page.tsx
// This file provides the UI for editing an existing prompt

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PROMPT_USE_CASES } from "@/lib/constants";

interface PromptFormData {
  title: string;
  content: string;
  useCase: string;
  source: string;
  createdBy?: string;
}

export default function EditPromptPage({
  params,
}: {
  params: { id: string };
}) {
  // Access the ID directly from params, using type assertion if needed
  const id = params.id;
  
  const { data: session, status } = useSession();
  const [prompt, setPrompt] = useState<PromptFormData>({
    title: "",
    content: "",
    useCase: PROMPT_USE_CASES[0],
    source: ""
  });
  const [customUseCase, setCustomUseCase] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  
  // Check authentication and fetch prompt data
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const fetchPrompt = async () => {
      try {
        console.log("Fetching prompt:", id);
        const res = await fetch(`/api/prompts/${id}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch prompt");
        }
        
        const data = await res.json();
        console.log("Prompt data:", data);
        
        // Check if user is authorized to edit this prompt
        if (data.createdBy !== session.user.id && session.user.role !== "ADMIN") {
          setError("You are not authorized to edit this prompt");
          setLoading(false);
          return;
        }
        
        setPrompt({
          title: data.title,
          content: data.content,
          useCase: data.useCase,
          source: data.source || "",
          createdBy: data.createdBy
        });
        
        // Set custom use case if needed
        if (!PROMPT_USE_CASES.includes(data.useCase)) {
          setCustomUseCase(data.useCase);
          setPrompt(prev => ({ ...prev, useCase: "Other" }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching prompt:", err);
        setError(err instanceof Error ? err.message : "Failed to load prompt data");
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    
    try {
      // If "Other" is selected and custom use case is provided, use that instead
      const finalUseCase = prompt.useCase === "Other" && customUseCase.trim() 
        ? customUseCase.trim() 
        : prompt.useCase;
      
      const res = await fetch(`/api/prompts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...prompt, 
          useCase: finalUseCase 
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      
      setSuccess("Prompt updated successfully" + 
        (session.user.role !== "ADMIN" ? " and submitted for moderation." : "."));
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(session.user.role === "ADMIN" ? "/admin" : "/prompts");
      }, 2000);
    } catch (err: unknown) {
      setSubmitting(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrompt(prev => ({ ...prev, [name]: value }));
  };

  if (loading && !error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-8 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Prompt</h1>
          <Link
            href="/prompts"
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Prompts
          </Link>
        </div>
        
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
              name="title"
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              value={prompt.title}
              onChange={handleChange}
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
              name="content"
              className="w-full border border-gray-300 rounded p-2 min-h-32"
              value={prompt.content}
              onChange={handleChange}
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
              name="useCase"
              className="w-full border border-gray-300 rounded p-2 input"
              value={prompt.useCase}
              onChange={handleChange}
              required
            >
              {PROMPT_USE_CASES.map((useCase) => (
                <option key={useCase} value={useCase}>
                  {useCase}
                </option>
              ))}
            </select>
            
            {prompt.useCase === "Other" && (
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
                  required={prompt.useCase === "Other"}
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
              name="source"
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              value={prompt.source}
              onChange={handleChange}
              placeholder="e.g. John Doe, ChatGPT, etc."
            />
          </div>
          
          {session?.user?.role !== "ADMIN" && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              <p>
                <strong>Note:</strong> Editing this prompt will reset its status to &quot;Pending&quot; and require 
                admin approval before it appears in the public library again.
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Link
              href="/prompts"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                "Update Prompt"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}