// File: src/app/api/prompts/[id]/upvote/route.ts
// This file handles the API route for toggling prompt upvotes (like/unlike)

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  // Await the params before accessing its properties
  const { id: promptId } = await context.params;
  
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to like/unlike" },
      { status: 401 }
    );
  }
  
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
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
          promptId: promptId
        }
      }
    });
    
    let updatedPrompt;
    
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
          upvotes: { decrement: 1 }
        }
      });
      
      return NextResponse.json({
        ...updatedPrompt,
        liked: false
      });
    } else {
      // User hasn't upvoted - add the upvote (like)
      const [, prompt] = await prisma.$transaction([
        prisma.userPromptUpvote.create({
          data: {
            userId: session.user.id,
            promptId: promptId
          }
        }),
        prisma.prompt.update({
          where: { id: promptId },
          data: {
            upvotes: { increment: 1 }
          }
        })
      ]);
      
      return NextResponse.json({
        ...prompt,
        liked: true
      });
    }
  } catch (error) {
    console.error("Error toggling upvote:", error);
    return NextResponse.json(
      { error: "Failed to process upvote" },
      { status: 500 }
    );
  }
}