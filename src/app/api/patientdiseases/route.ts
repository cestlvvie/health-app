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
        if (prismaError.meta?.field_name === 'patientdisease_email_fkey (index)') {
          return NextResponse.json(
            { error: 'The patient email does not exist in the users table.', details: prismaError.meta },
            { status: 400 }
          );
        }
        if (prismaError.meta?.field_name === 'patientdisease_disease_code_fkey (index)') {
          return NextResponse.json(
            { error: 'The disease code does not exist in the diseases table.', details: prismaError.meta },
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
  const { email, disease_code } = body;

  try {
    const newPatientDisease = await prisma.patientdisease.create({
      data: {
        email,
        disease_code,
      },
    });
    return NextResponse.json(newPatientDisease);
  } catch (error) {
    console.error('Error creating patient-disease association:', error);
    return handleError(error, 'Error creating patient-disease association');
  }
}

export async function GET() {
  try {
    const patientDiseases = await prisma.patientdisease.findMany({
      include: {
        users: true,
        disease: true,
      },
    });
    return NextResponse.json(patientDiseases);
  } catch (error) {
    console.error('Error fetching patient-disease associations:', error);
    return handleError(error, 'Error fetching patient-disease associations');
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { email, disease_code, new_disease_code } = body;

  try {
    const updatedPatientDisease = await prisma.patientdisease.update({
      where: { email_disease_code: { email, disease_code } },
      data: {
        disease_code: new_disease_code || disease_code,
      },
    });
    return NextResponse.json(updatedPatientDisease);
  } catch (error) {
    console.error('Error updating patient-disease association:', error);
    return handleError(error, 'Error updating patient-disease association');
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { email, disease_code } = body;

  try {
    const deletedPatientDisease = await prisma.patientdisease.delete({
      where: { email_disease_code: { email, disease_code } },
    });
    return NextResponse.json(deletedPatientDisease);
  } catch (error) {
    console.error('Error deleting patient-disease association:', error);
    return handleError(error, 'Error deleting patient-disease association');
  }
}
