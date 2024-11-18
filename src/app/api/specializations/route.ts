import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// Create a new specialization
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email } = body;

    const newSpecialization = await prisma.specialize.create({
      data: {
        id,
        email,
        // Assume related doctor and diseasetype already exist
      },
    });

    return NextResponse.json(newSpecialization); // Return the newly created specialization
  } catch (error) {
    console.error('Error creating specialization:', error);
    return handleError(error, 'Error creating specialization');
  }
}

// Fetch all specializations
export async function GET() {
  try {
    const specializations = await prisma.specialize.findMany({
      include: {
        doctor: true, // Include related doctor data
        diseasetype: true, // Include related diseasetype data
      },
    });

    return NextResponse.json(specializations);
  } catch (error) {
    console.error('Error fetching specializations:', error);
    return handleError(error, 'Error fetching specializations');
  }
}

 
// Delete a specialization
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, email } = body;

    const deletedSpecialization = await prisma.specialize.delete({
      where: {
        id_email: { id, email }, // Composite key
      },
    });

    return NextResponse.json(deletedSpecialization); // Return the deleted specialization
  } catch (error) {
    console.error('Error deleting specialization:', error);
    return handleError(error, 'Error deleting specialization');
  }
}

// Error handling utility
function handleError(error: unknown, defaultMessage: string) {
  if (error instanceof Error) {
    return NextResponse.json(
      { error: defaultMessage, details: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { error: defaultMessage, details: String(error) },
    { status: 500 }
  );
}
