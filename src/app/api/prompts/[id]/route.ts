// File: src/app/api/prompts/[id]/route.ts
// This file handles the API routes for individual prompts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET a specific prompt by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // Use this format instead of destructuring
    
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    );
  }
}

// DELETE a prompt
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to delete a prompt" },
      { status: 401 }
    );
  }
  
  try {
    const id = params.id; // Use this format instead of destructuring
    
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    });
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }
    
    // Check if user is the creator or an admin
    if (prompt.createdBy !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized to delete this prompt" },
        { status: 403 }
      );
    }
    
    // Delete any associated upvotes first
    await prisma.userPromptUpvote.deleteMany({
      where: { promptId: id },
    });
    
    // Then delete the prompt
    await prisma.prompt.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Prompt deleted successfully" });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
}

// PATCH a prompt to edit it
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to edit a prompt" },
      { status: 401 }
    );
  }
  
  try {
    const id = params.id; // Use this format instead of destructuring
    
    const prompt = await prisma.prompt.findUnique({
      where: { id },
    });
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }
    
    // Check if user is the creator or an admin
    if (prompt.createdBy !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized to edit this prompt" },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { title, content, useCase, source } = data;
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    // If user is not an admin, reset status to PENDING for moderation
    const updatedData = session.user.role === "ADMIN"
      ? { title, content, useCase, source }
      : { 
          title, 
          content, 
          useCase, 
          source,
          status: "PENDING" // Reset to pending when a regular user edits
        };
    
    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: updatedData,
    });
    
    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}