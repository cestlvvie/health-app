import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

function sanitizeRecord(data: any): any {
  if (typeof data === 'bigint') return data.toString();
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(sanitizeRecord);
  if (data && typeof data === 'object')
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, sanitizeRecord(value)]));
  return data;
}

function handleError(error: unknown, defaultMessage: string) {
  if (error instanceof Error) {
    if ('code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2003') {
        if (prismaError.meta?.field_name === 'record_cname_fkey (index)')
          return NextResponse.json({ error: 'Country does not exist.', details: prismaError.meta }, { status: 400 });
        if (prismaError.meta?.field_name === 'record_email_fkey (index)')
          return NextResponse.json(
            { error: 'Email does not exist in the public servants table.', details: prismaError.meta },
            { status: 400 }
          );
        if (prismaError.meta?.field_name === 'record_disease_code_fkey (index)')
          return NextResponse.json({ error: 'Disease code does not exist.', details: prismaError.meta }, { status: 400 });
      }
    }
    return NextResponse.json({ error: defaultMessage, details: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: defaultMessage, details: String(error) }, { status: 500 });
}

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
    return handleError(error, 'Error creating record');
  }
}

export async function GET() {
  try {
    const records = await prisma.record.findMany({
      include: {
        country: true,
        disease: true,
        publicservant: true,
      },
    });
    return NextResponse.json(records.map(sanitizeRecord));
  } catch (error) {
    return handleError(error, 'Error fetching records');
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, cname, disease_code, total_deaths, total_patients } = body;
    const updatedRecord = await prisma.record.update({
      where: { email_cname_disease_code: { email, cname, disease_code } },
      data: {
        total_deaths: total_deaths ? Number(total_deaths) : null,
        total_patients: total_patients ? Number(total_patients) : null,
      },
    });
    return NextResponse.json(sanitizeRecord(updatedRecord));
  } catch (error) {
    return handleError(error, 'Error updating record');
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { email, cname, disease_code } = body;
    const deletedRecord = await prisma.record.delete({
      where: { email_cname_disease_code: { email, cname, disease_code } },
    });
    return NextResponse.json(sanitizeRecord(deletedRecord));
  } catch (error) {
    return handleError(error, 'Error deleting record');
  }
}
