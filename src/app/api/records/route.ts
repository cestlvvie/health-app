import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// Helper function to sanitize data by converting BigInt values to strings
function sanitizeRecord(data: any): any {
  if (typeof data === 'bigint') {
    return data.toString(); // Convert BigInt to string
  }
  if (data instanceof Date) {
    return data.toISOString(); // Convert Date to ISO string
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeRecord); // Recursively sanitize array elements
  }
  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeRecord(value)])
    ); // Recursively sanitize object properties
  }
  return data; // Return other primitive types as-is
}

// Create a new record
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, cname, disease_code, total_deaths, total_patients } = body;

    const newRecord = await prisma.record.create({
      data: {
        email,
        cname,
        disease_code,
        total_deaths: total_deaths ? Number(total_deaths) : null,
        total_patients: total_patients ? Number(total_patients) : null,
      },
    });

    return NextResponse.json(sanitizeRecord(newRecord));
  } catch (error) {
    console.error('Error creating record:', error);
    return handleError(error, 'Error creating record');
  }
}

// Fetch all records
export async function GET() {
  try {
    const records = await prisma.record.findMany({
      include: {
        country: true, // Include related country data
        disease: true, // Include related disease data
        publicservant: true, // Include related public servant data
      },
    });

    // Sanitize records
    const sanitizedRecords = records.map(sanitizeRecord);

    return NextResponse.json(sanitizedRecords);
  } catch (error) {
    console.error('Error fetching records:', error);
    return handleError(error, 'Error fetching records');
  }
}

// Update a record's details
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, cname, disease_code, total_deaths, total_patients } = body;

    const updatedRecord = await prisma.record.update({
      where: {
        email_cname_disease_code: { email, cname, disease_code },
      },
      data: {
        total_deaths: total_deaths ? Number(total_deaths) : null,
        total_patients: total_patients ? Number(total_patients) : null,
      },
    });

    return NextResponse.json(sanitizeRecord(updatedRecord));
  } catch (error) {
    console.error('Error updating record:', error);
    return handleError(error, 'Error updating record');
  }
}

// Delete a record
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { email, cname, disease_code } = body;

    const deletedRecord = await prisma.record.delete({
      where: {
        email_cname_disease_code: { email, cname, disease_code },
      },
    });

    return NextResponse.json(sanitizeRecord(deletedRecord));
  } catch (error) {
    console.error('Error deleting record:', error);
    return handleError(error, 'Error deleting record');
  }
}

// Error handling utility
function handleError(error: unknown, defaultMessage: string) {
  if (error instanceof Error) {
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
