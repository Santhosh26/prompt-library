import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to upvote" },
      { status: 401 }
    );
  }
  
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    });
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }
    
    // Check if user already upvoted this prompt
    const existingUpvote = await prisma.userPromptUpvote.findUnique({
      where: {
        userId_promptId: {
          userId: session.user.id,
          promptId: id
        }
      }
    });
    
    if (existingUpvote) {
      return NextResponse.json(
        { error: "You have already upvoted this prompt" },
        { status: 400 }
      );
    }
    
    // Create upvote record and increment prompt upvote count in a transaction
    const [upvote, updatedPrompt] = await prisma.$transaction([
      prisma.userPromptUpvote.create({
        data: {
          userId: session.user.id,
          promptId: id
        }
      }),
      prisma.prompt.update({
        where: { id },
        data: {
          upvotes: { increment: 1 }
        }
      })
    ]);
    
    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error("Error upvoting prompt:", error);
    return NextResponse.json(
      { error: "Failed to upvote prompt" },
      { status: 500 }
    );
  }
}