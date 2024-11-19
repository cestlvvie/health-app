import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

function sanitizeRecord(data: any): any {
  if (typeof data === 'bigint') {
    return data.toString();
  }
  if (data instanceof Date) {
    return data.toISOString();
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeRecord);
  }
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeRecord(value)])
    );
  }
  return data;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cname, disease_code, first_enc_date } = body;

    const newRecord = await prisma.discover.create({
      data: {
        cname,
        disease_code,
        first_enc_date: first_enc_date ? new Date(first_enc_date) : null,
      },
    });

    return NextResponse.json(sanitizeRecord(newRecord));
  } catch (error) {
    console.error('Error creating discovery:', error);
    return handleError(error, 'Error creating discovery');
  }
}

export async function GET() {
  try {
    const records = await prisma.discover.findMany({
      include: {
        country: true,
        disease: true,
      },
    });

    const sanitizedRecords = records.map(sanitizeRecord);
    return NextResponse.json(sanitizedRecords);
  } catch (error) {
    console.error('Error fetching discoveries:', error);
    return handleError(error, 'Error fetching discoveries');
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { cname, disease_code, first_enc_date } = body;

    const updatedRecord = await prisma.discover.update({
      where: { cname_disease_code: { cname, disease_code } },
      data: {
        first_enc_date: first_enc_date ? new Date(first_enc_date) : null,
      },
    });

    return NextResponse.json(sanitizeRecord(updatedRecord));
  } catch (error) {
    console.error('Error updating discovery:', error);
    return handleError(error, 'Error updating discovery');
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { cname, disease_code } = body;

    const deletedRecord = await prisma.discover.delete({
      where: { cname_disease_code: { cname, disease_code } },
    });

    return NextResponse.json(sanitizeRecord(deletedRecord));
  } catch (error) {
    console.error('Error deleting discovery:', error);
    return handleError(error, 'Error deleting discovery');
  }
}

function handleError(error: unknown, defaultMessage: string) {
  if (error instanceof Error) {
    if ('code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2003') {
        if (prismaError.meta?.field_name === 'discover_cname_fkey (index)') {
          return NextResponse.json(
            { error: 'Country does not exist in the database.', details: prismaError.meta },
            { status: 400 }
          );
        }
        if (prismaError.meta?.field_name === 'discover_disease_code_fkey (index)') {
          return NextResponse.json(
            { error: 'Disease code does not exist in the database.', details: prismaError.meta },
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
