import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

function handleError(error: unknown, defaultMessage: string) {
  if (error instanceof Error) {
    if ('code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A disease type with this ID already exists.', details: prismaError.meta },
          { status: 400 }
        );
      }
    }
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

export async function POST(req: Request) {
  const body = await req.json();
  const { id, description } = body;

  try {
    const newDiseaseType = await prisma.diseasetype.create({
      data: {
        id,
        description,
      },
    });
    return NextResponse.json(newDiseaseType);
  } catch (error) {
    console.error('Error creating disease type:', error);
    return handleError(error, 'Error creating disease type');
  }
}

export async function GET() {
  try {
    const diseaseTypes = await prisma.diseasetype.findMany();
    return NextResponse.json(diseaseTypes);
  } catch (error) {
    console.error('Error fetching disease types:', error);
    return handleError(error, 'Error fetching disease types');
  }
}

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
    return NextResponse.json(updatedDiseaseType);
  } catch (error) {
    console.error('Error updating disease type:', error);
    return handleError(error, 'Error updating disease type');
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  try {
    const deletedDiseaseType = await prisma.diseasetype.delete({
      where: { id },
    });
    return NextResponse.json(deletedDiseaseType);
  } catch (error) {
    console.error('Error deleting disease type:', error);
    return handleError(error, 'Error deleting disease type');
  }
}
