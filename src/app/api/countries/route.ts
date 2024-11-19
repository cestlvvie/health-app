import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

function handleError(error: unknown) {
  if (error instanceof Error) {
    if ('code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2002') {
        return {
          error: 'A country with this name already exists.',
          details: prismaError.meta,
        };
      }
    }
    return { error: 'An error occurred while creating the country.', details: error.message };
  }
  return { error: 'An unknown error occurred.', details: String(error) };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { cname, population } = body;

  try {
    const newCountry = await prisma.country.create({
      data: {
        cname,
        population: population ? BigInt(population) : null,
      },
    });

    const formattedCountry = {
      ...newCountry,
      population: newCountry.population ? newCountry.population.toString() : null,
    };

    return NextResponse.json(formattedCountry);
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}

export async function GET() {
  try {
    const countries = await prisma.country.findMany();

    const formattedCountries = countries.map((country) => ({
      ...country,
      population: country.population ? country.population.toString() : null,
    }));

    return NextResponse.json(formattedCountries);
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { cname, population } = body;

  try {
    const updatedCountry = await prisma.country.update({
      where: { cname },
      data: {
        population: population ? BigInt(population) : null,
      },
    });

    const formattedCountry = {
      ...updatedCountry,
      population: updatedCountry.population ? updatedCountry.population.toString() : null,
    };

    return NextResponse.json(formattedCountry);
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { cname } = body;

  try {
    const deletedCountry = await prisma.country.delete({
      where: { cname },
    });

    const formattedCountry = {
      ...deletedCountry,
      population: deletedCountry.population ? deletedCountry.population.toString() : null,
    };

    return NextResponse.json(formattedCountry);
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}
