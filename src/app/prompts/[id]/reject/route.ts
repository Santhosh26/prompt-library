// src/app/api/prompts/[id]/reject/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const updated = await prisma.prompt.update({
      where: { id },
      data: {
        status: "REJECTED",
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error rejecting prompt" }, { status: 500 });
  }
}
