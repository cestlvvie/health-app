import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// POST: Add a new disease type
export async function POST(req: Request) {
  const body = await req.json(); // Parse the request body
  const { id, description } = body;

  try {
    const newDiseaseType = await prisma.diseasetype.create({
      data: {
        id,
        description,
      },
    });
    return NextResponse.json(newDiseaseType); // Return the newly created disease type
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating disease type:', error.message);
      return NextResponse.json(
        { error: 'Error creating disease type', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json(
        { error: 'Unknown error occurred', details: String(error) },
        { status: 500 }
      );
    }
  }
}

// GET: Fetch all disease types
export async function GET() {
  try {
    const diseaseTypes = await prisma.diseasetype.findMany();
    return NextResponse.json(diseaseTypes);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching disease types:', error.message);
      return NextResponse.json(
        { error: 'Error fetching disease types', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json(
        { error: 'Unknown error occurred', details: String(error) },
        { status: 500 }
      );
    }
  }
}

// PUT: Update a disease type's details
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, description } = body;

  try {
    const updatedDiseaseType = await prisma.diseasetype.update({
      where: { id },
      data: {
        description,
      },
    });
    return NextResponse.json(updatedDiseaseType); // Return the updated disease type
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating disease type:', error.message);
      return NextResponse.json(
        { error: 'Error updating disease type', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json(
        { error: 'Unknown error occurred', details: String(error) },
        { status: 500 }
      );
    }
  }
}

// DELETE: Remove a disease type
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  try {
    const deletedDiseaseType = await prisma.diseasetype.delete({
      where: { id },
    });
    return NextResponse.json(deletedDiseaseType); // Return the deleted disease type
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting disease type:', error.message);
      return NextResponse.json(
        { error: 'Error deleting disease type', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json(
        { error: 'Unknown error occurred', details: String(error) },
        { status: 500 }
      );
    }
  }
}
