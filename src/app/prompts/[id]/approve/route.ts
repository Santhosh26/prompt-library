import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  
  // Check if user is an admin
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }
  
  try {
    const updated = await prisma.prompt.update({
      where: { id },
      data: {
        status: "APPROVED",
      },
    });
    
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error approving prompt" },
      { status: 500 }
    );
  }
}