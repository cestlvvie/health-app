import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// Create a new public servant
export async function POST(req: Request) {
  const body = await req.json(); // Parse the request body
  const { email, department } = body;

  try {
    const newPublicServant = await prisma.publicservant.create({
      data: {
        email,
        department,
        // The related user record must exist before this call
      },
    });
    return NextResponse.json(newPublicServant); // Return the newly created public servant
  } catch (error) {
    console.error('Error creating public servant:', error); // Log the error
    return NextResponse.json(
      { error: 'Error creating public servant', details: error },
      { status: 500 }
    );
  }
}

// Fetch all public servants
export async function GET() {
  try {
    const publicServants = await prisma.publicservant.findMany({
      include: {
        users: true, // Include related user data
      },
    });
    return NextResponse.json(publicServants);
  } catch (error) {
    console.error('Error fetching public servants:', error); // Log the error
    return NextResponse.json(
      { error: 'Error fetching public servants', details: error },
      { status: 500 }
    );
  }
}

// Update a public servant's details
export async function PUT(req: Request) {
  const body = await req.json();
  const { email, department } = body;

  try {
    const updatedPublicServant = await prisma.publicservant.update({
      where: { email },
      data: {
        department,
      },
    });
    return NextResponse.json(updatedPublicServant); // Return the updated public servant
  } catch (error) {
    console.error('Error updating public servant:', error); // Log the error
    return NextResponse.json(
      { error: 'Error updating public servant', details: error },
      { status: 500 }
    );
  }
}

// Delete a public servant
export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedPublicServant = await prisma.publicservant.delete({
      where: { email },
    });
    return NextResponse.json(deletedPublicServant); // Return the deleted public servant
  } catch (error) {
    console.error('Error deleting public servant:', error); // Log the error
    return NextResponse.json(
      { error: 'Error deleting public servant', details: error },
      { status: 500 }
    );
  }
}
