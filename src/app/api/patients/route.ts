import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// Create a new patient
export async function POST(req: Request) {
  const body = await req.json(); // Parse the request body
  const { email } = body;

  try {
    const newPatient = await prisma.patients.create({
      data: {
        email,
        // The related user record must exist before this call
      },
    });
    return NextResponse.json(newPatient); // Return the newly created patient
  } catch (error) {
    console.error('Error creating patient:', error); // Log the error
    return NextResponse.json(
      { error: 'Error creating patient', details: error },
      { status: 500 }
    );
  }
}

// Fetch all patients
export async function GET() {
  try {
    const patients = await prisma.patients.findMany({
      include: {
        users: true, // Include related user data
      },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error); // Log the error
    return NextResponse.json(
      { error: 'Error fetching patients', details: error },
      { status: 500 }
    );
  }
}

// Update a patient's details
export async function PUT(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const updatedPatient = await prisma.patients.update({
      where: { email },
      data: {
        // No additional data to update directly on patients
        // Related data updates should happen in users
      },
    });
    return NextResponse.json(updatedPatient); // Return the updated patient
  } catch (error) {
    console.error('Error updating patient:', error); // Log the error
    return NextResponse.json(
      { error: 'Error updating patient', details: error },
      { status: 500 }
    );
  }
}

// Delete a patient
export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedPatient = await prisma.patients.delete({
      where: { email },
    });
    return NextResponse.json(deletedPatient); // Return the deleted patient
  } catch (error) {
    console.error('Error deleting patient:', error); // Log the error
    return NextResponse.json(
      { error: 'Error deleting patient', details: error },
      { status: 500 }
    );
  }
}
