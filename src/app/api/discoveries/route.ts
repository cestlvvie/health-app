import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// Helper function to recursively sanitize data
function sanitizeDiscovery(data: any): any {
  if (typeof data === 'bigint') {
    return data.toString(); // Convert BigInt to string
  }

  if (data instanceof Date) {
    return data.toISOString(); // Convert Date to ISO string
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeDiscovery); // Recursively sanitize array elements
  }

  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeDiscovery(value)])
    ); // Recursively sanitize object properties
  }

  return data; // Return other primitive types as-is
}

// Create a new discovery
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cname, disease_code, first_enc_date } = body;

    const newDiscovery = await prisma.discover.create({
      data: {
        cname,
        disease_code,
        first_enc_date: first_enc_date ? new Date(first_enc_date) : null, // Handle optional Date
      },
    });

    return NextResponse.json(sanitizeDiscovery(newDiscovery));
  } catch (error) {
    console.error('Error creating discovery:', error);
    return handleError(error, 'Error creating discovery');
  }
}

// Fetch all discoveries
export async function GET() {
  try {
    const discoveries = await prisma.discover.findMany({
      include: {
        country: true, // Include related country data
        disease: true, // Include related disease data
      },
    });

    // Recursively sanitize all discoveries
    const sanitizedDiscoveries = discoveries.map(sanitizeDiscovery);

    return NextResponse.json(sanitizedDiscoveries);
  } catch (error) {
    console.error('Error fetching discoveries:', error);
    return handleError(error, 'Error fetching discoveries');
  }
}

// Update a discovery's details
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { cname, disease_code, first_enc_date } = body;

    const updatedDiscovery = await prisma.discover.update({
      where: { cname_disease_code: { cname, disease_code } },
      data: {
        first_enc_date: first_enc_date ? new Date(first_enc_date) : null,
      },
    });

    return NextResponse.json(sanitizeDiscovery(updatedDiscovery));
  } catch (error) {
    console.error('Error updating discovery:', error);
    return handleError(error, 'Error updating discovery');
  }
}

// Delete a discovery
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { cname, disease_code } = body;

    const deletedDiscovery = await prisma.discover.delete({
      where: { cname_disease_code: { cname, disease_code } },
    });

    return NextResponse.json(sanitizeDiscovery(deletedDiscovery));
  } catch (error) {
    console.error('Error deleting discovery:', error);
    return handleError(error, 'Error deleting discovery');
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
