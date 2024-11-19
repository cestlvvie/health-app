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
          { error: 'A patient with this email already exists.', details: prismaError.meta },
          { status: 400 }
        );
      }
      if (prismaError.code === 'P2003') {
        if (prismaError.meta?.field_name === 'patients_email_fkey (index)') {
          return NextResponse.json(
            { error: 'The user with the provided email does not exist.', details: prismaError.meta },
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
  const { email } = body;

  try {
    const newPatient = await prisma.patients.create({
      data: {
        email,
      },
    });
    return NextResponse.json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    return handleError(error, 'Error creating patient');
  }
}

export async function GET() {
  try {
    const patients = await prisma.patients.findMany({
      include: {
        users: true,
      },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return handleError(error, 'Error fetching patients');
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const updatedPatient = await prisma.patients.update({
      where: { email },
      data: {},
    });
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return handleError(error, 'Error updating patient');
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedPatient = await prisma.patients.delete({
      where: { email },
    });
    return NextResponse.json(deletedPatient);
  } catch (error) {
    console.error('Error deleting patient:', error);
    return handleError(error, 'Error deleting patient');
  }
}
