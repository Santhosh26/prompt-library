"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Prompt {
  id: string;
  title: string;
  content: string;
  useCase: string;
  source: string;
  upvotes: number;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/prompts?createdBy=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPrompts(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching prompts:", err);
          setLoading(false);
        });
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-slate-600 mb-8">
            You need to be signed in to view your profile.
          </p>
          <Link 
            href="/auth/signin"
            className="btn btn-primary btn-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Approved</span>;
      case "PENDING":
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
              {session.user.name ? session.user.name.charAt(0).toUpperCase() : session.user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{session.user.name || "User"}</h1>
              <p className="text-slate-500">{session.user.email}</p>
              {session.user.role === "ADMIN" && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-2 inline-block">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">My Submissions</h2>
        
        {prompts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-slate-600 mb-6">You haven&apos;t submitted any prompts yet.</p>
            <Link 
              href="/prompts/new" 
              className="btn btn-primary"
            >
              Submit Your First Prompt
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">
                      <Link href={`/prompts/${prompt.id}`} className="hover:text-blue-600 transition-colors">
                        {prompt.title}
                      </Link>
                    </h3>
                    {getStatusBadge(prompt.status)}
                  </div>
                  <p className="text-slate-600 mb-4">
                    {prompt.content.length > 100
                      ? prompt.content.substring(0, 100) + "..."
                      : prompt.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {prompt.useCase}
                    </span>
                    <span className="text-slate-500 text-xs px-2 py-1">
                      {prompt.upvotes} upvotes
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Submitted on {formatDate(prompt.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}