import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// GET all prompts or filtered by user
export async function GET(request: NextRequest) {
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
      },
    });
    
    return NextResponse.json(prompts);
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