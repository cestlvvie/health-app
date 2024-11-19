import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], 
});

function handlePrismaError(error: unknown) {
  if (error instanceof Error && 'code' in error) {
    const prismaError = error as any;
    switch (prismaError.code) {
      case 'P2003':  
        if (prismaError.meta?.field_name === 'specialize_email_fkey (index)') {
          return {
            error: 'Foreign key constraint violated: The provided email does not exist in the doctor table.',
            details: prismaError.meta,
          };
        }
        if (prismaError.meta?.field_name === 'specialize_id_fkey (index)') {
          return {
            error: 'Foreign key constraint violated: The provided disease type ID does not exist.',
            details: prismaError.meta,
          };
        }
        return {
          error: 'Foreign key constraint violated: Related record does not exist.',
          details: prismaError.meta,
        };
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
  try {
    const body = await req.json();
    const { id, email } = body;

    const newSpecialization = await prisma.specialize.create({
      data: {
        id,
        email,
      },
    });

    return NextResponse.json(newSpecialization);  
  } catch (error) {
    console.error('Error creating specialization:', error);
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}

 
export async function GET() {
  try {
    const specializations = await prisma.specialize.findMany({
      include: {
        doctor: true,  
        diseasetype: true,  
      },
    });

    return NextResponse.json(specializations);
  } catch (error) {
    console.error('Error fetching specializations:', error);
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, email } = body;

    const deletedSpecialization = await prisma.specialize.delete({
      where: {
        id_email: { id, email }, 
      },
    });

    return NextResponse.json(deletedSpecialization);  
  } catch (error) {
    console.error('Error deleting specialization:', error);
    const handledError = handlePrismaError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}
