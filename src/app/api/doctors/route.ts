import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// Create a new doctor
export async function POST(req: Request) {
  const body = await req.json(); // Parse the request body
  const { email, degree } = body;

  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        email,
        degree,
        // Assume users relation is handled elsewhere (must exist before this call)
      },
    });
    return NextResponse.json(newDoctor); // Return the newly created doctor
  } catch (error) {
    console.error('Error creating doctor:', error); // Log the error
    return NextResponse.json({ error: 'Error creating doctor', details: error }, { status: 500 });
  }
}

// Fetch all doctors
export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        users: true, // Include related user data
        specialize: true, // Include specialization data
      },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error); // Log the error
    return NextResponse.json({ error: 'Error fetching doctors', details: error }, { status: 500 });
  }
}

// Update a doctor's details
export async function PUT(req: Request) {
  const body = await req.json();
  const { email, degree } = body;

  try {
    const updatedDoctor = await prisma.doctor.update({
      where: { email },
      data: {
        degree,
        // Update any other fields here
      },
    });
    return NextResponse.json(updatedDoctor); // Return the updated doctor
  } catch (error) {
    console.error('Error updating doctor:', error); // Log the error
    return NextResponse.json({ error: 'Error updating doctor', details: error }, { status: 500 });
  }
}

// Delete a doctor by email
export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedDoctor = await prisma.doctor.delete({
      where: { email },
    });
    return NextResponse.json(deletedDoctor); // Return the deleted doctor
  } catch (error) {
    console.error('Error deleting doctor:', error); // Log the error
    return NextResponse.json({ error: 'Error deleting doctor', details: error }, { status: 500 });
  }
}
