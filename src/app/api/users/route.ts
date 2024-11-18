import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});


export async function POST(req: Request) {
  const body = await req.json(); // Parse the request body
  const { email, name, surname, salary, phone, cname } = body;

  try {
    const newUser = await prisma.users.create({
      data: {
        email,
        name,
        surname,
        salary: Number(salary), // Convert string to number
        phone,
        cname,
      },
    });
    return NextResponse.json(newUser); // Return the newly created user
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user', details: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error); // Log the error to the console
    return NextResponse.json({ error: 'Error fetching users', details: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { email, name, surname, salary, phone, cname } = body;

  try {
    const updatedUser = await prisma.users.update({
      where: { email },
      data: {
        name,
        surname,
        salary: Number(salary), // Convert string to number
        phone,
        cname,
      },
    });
    return NextResponse.json(updatedUser); // Return the updated user
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user', details: error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedUser = await prisma.users.delete({
      where: { email },
    });
    return NextResponse.json(deletedUser); // Return the deleted user
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting user', details: error }, { status: 500 });
  }
}
