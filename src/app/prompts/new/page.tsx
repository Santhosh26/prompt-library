"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/[...nextauth]/route";

export default async function NewPromptPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Please sign in to submit a new prompt.</div>;
  }

  // Client component for form submission must be wrapped in "use client"
  return <NewPromptForm />;
}

function NewPromptForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [useCase, setUseCase] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, useCase, source }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      router.push("/prompts");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Submit a New Prompt</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Marketing Email Generator"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Content</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="The actual prompt text..."
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Use Case</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="e.g. Email marketing"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Source / Credits</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. John Doe, ChatGPT, etc."
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
