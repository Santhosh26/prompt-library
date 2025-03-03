// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient, Prompt } from "@prisma/client";


const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/"); // or show 403 page
  }

  const prompts = await prisma.prompt.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin - Pending Prompts</h1>
      {prompts.length === 0 ? (
        <p>No pending prompts</p>
      ) : (
        <ul className="space-y-4">
          {prompts.map((prompt: Prompt) => (
            <li key={prompt.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{prompt.title}</h2>
              <p className="text-gray-600">{prompt.content}</p>
              <div className="mt-2 flex space-x-2">
                <form action={`/api/prompts/${prompt.id}/approve`} method="POST">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                </form>
                <form action={`/api/prompts/${prompt.id}/reject`} method="POST">
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
