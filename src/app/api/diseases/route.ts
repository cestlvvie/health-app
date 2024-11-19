import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

function handleError(error: unknown, defaultMessage: string) {
  if (error instanceof Error) {
    if ('code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2003') {
        if (prismaError.meta?.field_name === 'disease_id_fkey (index)') {
          return NextResponse.json(
            { error: 'Disease type ID does not exist.', details: prismaError.meta },
            { status: 400 }
          );
        }
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
    return NextResponse.json(newDisease);
  } catch (error) {
    console.error('Error creating disease:', error);
    return handleError(error, 'Error creating disease');
  }
}

export async function GET() {
  try {
    const diseases = await prisma.disease.findMany({
      include: {
        diseasetype: true,
        discover: true,
        patientdisease: true,
        record: true,
      },
    });
    return NextResponse.json(diseases);
  } catch (error) {
    console.error('Error fetching diseases:', error);
    return handleError(error, 'Error fetching diseases');
  }
}

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
    return NextResponse.json(updatedDisease);
  } catch (error) {
    console.error('Error updating disease:', error);
    return handleError(error, 'Error updating disease');
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { disease_code } = body;

  try {
    const deletedDisease = await prisma.disease.delete({
      where: { disease_code },
    });
    return NextResponse.json(deletedDisease);
  } catch (error) {
    console.error('Error deleting disease:', error);
    return handleError(error, 'Error deleting disease');
  }
}
