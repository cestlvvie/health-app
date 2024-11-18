import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// Create a new patient-disease association
export async function POST(req: Request) {
  const body = await req.json(); // Parse the request body
  const { email, disease_code } = body;

  try {
    const newPatientDisease = await prisma.patientdisease.create({
      data: {
        email,
        disease_code,
        // Assume related user and disease records exist
      },
    });
    return NextResponse.json(newPatientDisease); // Return the newly created record
  } catch (error) {
    console.error('Error creating patient-disease association:', error); // Log the error
    return NextResponse.json(
      { error: 'Error creating patient-disease association', details: error },
      { status: 500 }
    );
  }
}

// Fetch all patient-disease associations
export async function GET() {
  try {
    const patientDiseases = await prisma.patientdisease.findMany({
      include: {
        users: true, // Include related user data
        disease: true, // Include related disease data
      },
    });
    return NextResponse.json(patientDiseases);
  } catch (error) {
    console.error('Error fetching patient-disease associations:', error); // Log the error
    return NextResponse.json(
      { error: 'Error fetching patient-disease associations', details: error },
      { status: 500 }
    );
  }
}

// Update a patient-disease association
export async function PUT(req: Request) {
  const body = await req.json();
  const { email, disease_code, new_disease_code } = body;

  try {
    const updatedPatientDisease = await prisma.patientdisease.update({
      where: { email_disease_code: { email, disease_code } },
      data: {
        disease_code: new_disease_code || disease_code, // Update to new disease_code if provided
      },
    });
    return NextResponse.json(updatedPatientDisease); // Return the updated record
  } catch (error) {
    console.error('Error updating patient-disease association:', error); // Log the error
    return NextResponse.json(
      { error: 'Error updating patient-disease association', details: error },
      { status: 500 }
    );
  }
}

// Delete a patient-disease association
export async function DELETE(req: Request) {
  const body = await req.json();
  const { email, disease_code } = body;

  try {
    const deletedPatientDisease = await prisma.patientdisease.delete({
      where: { email_disease_code: { email, disease_code } },
    });
    return NextResponse.json(deletedPatientDisease); // Return the deleted record
  } catch (error) {
    console.error('Error deleting patient-disease association:', error); // Log the error
    return NextResponse.json(
      { error: 'Error deleting patient-disease association', details: error },
      { status: 500 }
    );
  }
}
