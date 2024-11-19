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
          { error: 'A public servant with this email already exists.', details: prismaError.meta },
          { status: 400 }
        );
      }
      if (prismaError.code === 'P2003') {
        if (prismaError.meta?.field_name === 'publicservant_email_fkey (index)') {
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
  const { email, department } = body;

  try {
    const newPublicServant = await prisma.publicservant.create({
      data: {
        email,
        department,
      },
    });
    return NextResponse.json(newPublicServant);
  } catch (error) {
    console.error('Error creating public servant:', error);
    return handleError(error, 'Error creating public servant');
  }
}

export async function GET() {
  try {
    const publicServants = await prisma.publicservant.findMany({
      include: {
        users: true,
      },
    });
    return NextResponse.json(publicServants);
  } catch (error) {
    console.error('Error fetching public servants:', error);
    return handleError(error, 'Error fetching public servants');
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { email, department } = body;

  try {
    const updatedPublicServant = await prisma.publicservant.update({
      where: { email },
      data: { department },
    });
    return NextResponse.json(updatedPublicServant);
  } catch (error) {
    console.error('Error updating public servant:', error);
    return handleError(error, 'Error updating public servant');
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    const deletedPublicServant = await prisma.publicservant.delete({
      where: { email },
    });
    return NextResponse.json(deletedPublicServant);
  } catch (error) {
    console.error('Error deleting public servant:', error);
    return handleError(error, 'Error deleting public servant');
  }
}
