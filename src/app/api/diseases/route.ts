import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// POST: Add a new disease
export async function POST(req: Request) {
  const body = await req.json();
  const { disease_code, pathogen, description, id } = body;

  try {
    const newDisease = await prisma.disease.create({
      data: {
        disease_code,
        pathogen,
        description,
        id,
      },
    });
    return NextResponse.json(newDisease); // Return the newly created disease
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating disease:', error.message);
      return NextResponse.json(
        { error: 'Error creating disease', details: error.message },
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

// GET: Fetch all diseases
export async function GET() {
  try {
    const diseases = await prisma.disease.findMany({
      include: {
        diseasetype: true, // Include related disease type data
        discover: true, // Include discover relationships
        patientdisease: true, // Include patient disease relationships
        record: true, // Include record relationships
      },
    });
    return NextResponse.json(diseases);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching diseases:', error.message);
      return NextResponse.json(
        { error: 'Error fetching diseases', details: error.message },
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

// PUT: Update a disease's details
export async function PUT(req: Request) {
  const body = await req.json();
  const { disease_code, pathogen, description, id } = body;

  try {
    const updatedDisease = await prisma.disease.update({
      where: { disease_code },
      data: {
        pathogen,
        description,
        id,
      },
    });
    return NextResponse.json(updatedDisease); // Return the updated disease
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating disease:', error.message);
      return NextResponse.json(
        { error: 'Error updating disease', details: error.message },
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

// DELETE: Remove a disease
export async function DELETE(req: Request) {
  const body = await req.json();
  const { disease_code } = body;

  try {
    const deletedDisease = await prisma.disease.delete({
      where: { disease_code },
    });
    return NextResponse.json(deletedDisease); // Return the deleted disease
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting disease:', error.message);
      return NextResponse.json(
        { error: 'Error deleting disease', details: error.message },
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
