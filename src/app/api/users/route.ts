import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],  
});

function handlePrismaError(error: unknown) {
  if (error instanceof Error && 'code' in error) {
    const prismaError = error as any;
    switch (prismaError.code) {
      case 'P2002':  
        return { error: 'This email already exists', details: prismaError.meta };
      case 'P2003':  
        return { error: 'This country does not exist', details: prismaError.meta };
      default:
        return { error: 'Database error occurred', details: prismaError.message };
    }
  }

  if (error instanceof Error) {
    return { error: 'An unexpected error occurred', details: error.message };
  }

  return { error: 'An unknown error occurred', details: String(error) };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, surname, salary, phone, cname } = body;

  try {
    const newUser = await prisma.users.create({
      data: {
        email,
        name,
        surname,
        salary: Number(salary),
        phone,
        cname,
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, { status: 500 });
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
        salary: Number(salary),
        phone,
        cname,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedUser = await prisma.users.delete({
      where: { email },
    });
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}
