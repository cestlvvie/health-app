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
          { error: 'A doctor with this email already exists.', details: prismaError.meta },
          { status: 400 }
        );
      }
      if (prismaError.code === 'P2003') {
        if (prismaError.meta?.field_name === 'doctor_email_fkey (index)') {
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
  const { email, degree } = body;

  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        email,
        degree,
      },
    });
    return NextResponse.json(newDoctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    return handleError(error, 'Error creating doctor');
  }
}

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        users: true,
        specialize: true,
      },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return handleError(error, 'Error fetching doctors');
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { email, degree } = body;

  try {
    const updatedDoctor = await prisma.doctor.update({
      where: { email },
      data: { degree },
    });
    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return handleError(error, 'Error updating doctor');
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedDoctor = await prisma.doctor.delete({
      where: { email },
    });
    return NextResponse.json(deletedDoctor);
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return handleError(error, 'Error deleting doctor');
  }
}
