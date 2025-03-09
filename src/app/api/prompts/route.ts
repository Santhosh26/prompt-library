// File: src/app/api/prompts/route.ts
// Updated to include liked status in the response

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
// GET all prompts or filtered by user
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const createdBy = searchParams.get("createdBy");
  
  try {
    const prompts = await prisma.prompt.findMany({
      where: createdBy ? { createdBy } : undefined,
      orderBy: {
        upvotes: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        // Include relationship with upvotes to check if current user has liked
        upvotedBy: session ? {
          where: {
            userId: session.user.id
          },
          select: {
            userId: true
          }
        } : undefined
      },
    });
    
    // If user is admin, don't filter prompts by status
    // Otherwise, filter approved prompts if not showing user's prompts
    const filteredPrompts = session?.user?.role === "ADMIN"
      ? prompts
      : createdBy 
        ? prompts 
        : prompts.filter((p) => p.status === "APPROVED");
      
    // Add liked property to each prompt
    const promptsWithLikedStatus = filteredPrompts.map(prompt => {
      // Remove upvotedBy from response and add a liked flag based on it
      const { upvotedBy, ...promptData } = prompt;
      return {
        ...promptData,
        liked: session ? upvotedBy.length > 0 : false
      };
    });
    
    return NextResponse.json(promptsWithLikedStatus);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}
// POST a new prompt
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to submit a prompt" },
      { status: 401 }
    );
  }
  
  try {
    const reqData = await request.json();
    const { title, content, source } = reqData;
    
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    // Validate the use case
    const finalUseCase = reqData.useCase || "Other";
    
    const prompt = await prisma.prompt.create({
      data: {
        title,
        content,
        useCase: finalUseCase,
        source: source || "Anonymous",
        createdBy: session.user.id,
      },
    });
    
    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}