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
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#10a37f] hover:bg-[#0e8f70] text-white rounded-md font-medium transition-colors"
          >
            {/* ChatGPT Logo */}
            <svg width="20" height="20" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" className="h-5 w-5">
              <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.979 37.1492C15.9209 38.2107 17.0786 39.0587 18.3748 39.6366C19.671 40.2144 21.0756 40.5087 22.4947 40.4998C24.6297 40.5049 26.7112 39.8319 28.4391 38.5778C30.167 37.3237 31.452 35.5533 32.1088 33.5218C33.4996 33.2371 34.8136 32.6585 35.9628 31.8249C37.1119 30.9913 38.0697 29.9217 38.7721 28.688C39.8441 26.8408 40.3017 24.7011 40.0789 22.5772C39.8561 20.4533 38.9645 18.4551 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0628C14.3065 10.262 14.2466 10.4882 14.2479 10.7181L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path>
            </svg>
            Try with ChatGPT
          </button>
          
          <button
            onClick={handleTryWithClaude}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F3CE6] hover:bg-[#5f34c4] text-white rounded-md font-medium transition-colors"
          >
            {/* Claude Logo */}
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3C8.376 3 3 8.376 3 15C3 21.624 8.376 27 15 27C21.624 27 27 21.624 27 15C27 8.376 21.624 3 15 3ZM20.454 17.568C20.454 17.568 19.629 18.465 17.883 18.465C16.662 18.465 16.077 17.883 15.009 17.883C12.249 17.883 10.998 19.914 9.585 19.914C8.829 19.914 8.289 19.515 8.289 19.515C10.116 22.881 14.076 23.877 16.656 22.119C19.236 20.364 20.976 17.883 20.454 17.568ZM10.107 15.072C11.208 15.072 12.105 14.178 12.105 13.074C12.105 11.97 11.208 11.076 10.107 11.076C9.006 11.076 8.109 11.97 8.109 13.074C8.109 14.178 9.006 15.072 10.107 15.072ZM19.893 15.072C20.994 15.072 21.891 14.178 21.891 13.074C21.891 11.97 20.994 11.076 19.893 11.076C18.792 11.076 17.895 11.97 17.895 13.074C17.895 14.178 18.792 15.072 19.893 15.072Z" fill="currentColor"/>
            </svg>
            Try with Claude
          </button>
          
          <button
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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