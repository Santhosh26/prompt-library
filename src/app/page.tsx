"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pb-16 pt-20 lg:pt-24">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            className="text-center mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl  text-blue-100 lg:text-6xl font-bold tracking-tight mb-6">
              Welcome to the Prompt Valt
            </h1>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Discover, share, and upvote the best LLM prompts curated by our community.
              Whether you need inspiration or want to showcase your creativity, our platform
              has something for everyone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/prompts"
                className="btn btn-lg btn-secondary bg-white text-blue-700  hover:bg-purple-100"
              >
                Browse Prompts
              </Link>
              {session ? (
                <Link
                  href="/prompts/new"
                  className="btn btn-lg btn-primary bg-white text-blue-700 hover:bg-blue-50"
                >
                  Create a Prompt
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="btn btn-lg btn-primary bg-white text-blue-700 hover:bg-blue-50"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 120L48 106.7C96 93.3 192 66.7 288 53.3C384 40 480 40 576 46.7C672 53.3 768 66.7 864 80C960 93.3 1056 106.7 1152 100C1248 93.3 1344 66.7 1392 53.3L1440 40V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Features
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to find, share and collaborate on prompts for AI models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-slate-50 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">
                Browse a growing collection of prompts categorized by use case and upvoted by the community.
              </p>
              <Link href="/prompts" className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-500">
                Explore library →
              </Link>
            </motion.div>

            <motion.div
              className="bg-slate-50 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-600">
                Submit your own prompts with detailed use cases, making it easy for others to implement your creative ideas.
              </p>
              <Link href="/prompts/new" className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Submit a prompt →
              </Link>
            </motion.div>

            <motion.div
              className="bg-slate-50 rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upvote</h3>
              <p className="text-gray-600">
                Vote for your favorite prompts and help the community identify the most useful and effective ones.
              </p>
              <Link href="/auth/signin" className="inline-block mt-4 text-sm font-medium text-purple-600 hover:text-purple-500">
                Join community →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-16">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Ready to contribute to the prompt library?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-blue-100">
                  Join our community today and start sharing your best prompts with the world.
                  Your creative expertise could help unlock new possibilities for AI users everywhere.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="flex space-x-4 max-w-md">
                  <Link href="/auth/signin" className="flex-1.5 btn btn-lg bg-white text-blue-600 hover:bg-blue-50 shadow">
                    Sign in 
                  </Link>
                  <Link href="/auth/signup" className="flex-2 btn btn-lg bg-blue-800 text-white hover:bg-blue-700 shadow border border-transparent">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to find and share the perfect prompts for any AI task
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="absolute left-8 top-8 w-0.5 h-full bg-blue-200 -z-10 hidden lg:block"></div>
              <div className="bg-blue-600 text-white text-xl font-bold w-16 h-16 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up to join our community of prompt engineers and AI enthusiasts.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-8 top-8 w-0.5 h-full bg-blue-200 -z-10 hidden lg:block"></div>
              <div className="bg-blue-600 text-white text-xl font-bold w-16 h-16 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse the Library</h3>
              <p className="text-gray-600">
                Explore our growing collection of prompts, sorted by use case and popularity.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-8 top-8 w-0.5 h-full bg-blue-200 -z-10 hidden lg:block"></div>
              <div className="bg-blue-600 text-white text-xl font-bold w-16 h-16 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Your Prompts</h3>
              <p className="text-gray-600">
                Share your own custom prompts, complete with use cases and examples.
              </p>
            </div>
            
            <div>
              <div className="bg-blue-600 text-white text-xl font-bold w-16 h-16 rounded-full flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Community Feedback</h3>
              <p className="text-gray-600">
                Receive upvotes and feedback on your submissions from other users.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of AI enthusiasts who are already enhancing their AI interactions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                  D
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">David K.</h3>
                  <p className="text-sm text-gray-500">AI Developer</p>
                </div>
              </div>
              <p className="text-gray-600">
              &quot;This platform has saved me countless hours of prompt engineering. I&apos;ve found prompts 
                that have dramatically improved my AI workflow.&quot;
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Sarah T.</h3>
                  <p className="text-sm text-gray-500">Content Creator</p>
                </div>
              </div>
              <p className="text-gray-600">
               &quot;The variety of prompts available has expanded my creative horizons. I&apos;ve discovered 
                techniques I would never have thought of on my own.&quot;
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Michael R.</h3>
                  <p className="text-sm text-gray-500">Researcher</p>
                </div>
              </div>
              <p className="text-gray-600">
              &quot;The community aspect is fantastic. Getting feedback on my prompts has helped me 
                refine my approach to AI interactions in my research.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Prompt Library. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}