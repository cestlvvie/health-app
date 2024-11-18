import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logs
});

// POST: Add a new country
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
  
      console.log('Successfully created country:', formattedCountry);
      return NextResponse.json(formattedCountry); // Return the created country
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating country:', error.message);
        return NextResponse.json(
          { error: 'Error creating country', details: error.message },
          { status: 500 }
        );
      } else {
        console.error('Unknown error:', error);
        return NextResponse.json(
          { error: 'Unknown error occurred', details: String(error) },
          { status: 500 }
        );
      }
    }
  }
  
  

// GET: Fetch all countries
export async function GET() {
    try {
      const countries = await prisma.country.findMany();
  
      // Convert BigInt fields to strings
      const formattedCountries = countries.map((country) => ({
        ...country,
        population: country.population ? country.population.toString() : null,
      }));
  
      return NextResponse.json(formattedCountries);
    } catch (error) {
      console.error('Error fetching countries:', error); // Log the error to the console
      return NextResponse.json({ error: 'Error fetching countries', details: error }, { status: 500 });
    }
  }
  

// PUT: Update a country's details
export async function PUT(req: Request) {
    const body = await req.json();
    const { cname, population } = body;
  
    try {
      const updatedCountry = await prisma.country.update({
        where: { cname },
        data: {
          population: population ? BigInt(population) : null, // Convert string to BigInt
        },
      });
  
      const formattedCountry = {
        ...updatedCountry,
        population: updatedCountry.population ? updatedCountry.population.toString() : null,
      };
  
      console.log('Successfully updated country:', formattedCountry);
      return NextResponse.json(formattedCountry); // Return the updated country
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating country:', error.message);
        return NextResponse.json(
          { error: 'Error updating country', details: error.message },
          { status: 500 }
        );
      } else {
        console.error('Unknown error:', error);
        return NextResponse.json(
          { error: 'Unknown error occurred', details: String(error) },
          { status: 500 }
        );
      }
    }
  }  

// DELETE: Remove a country
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
  
      console.log('Successfully deleted country:', formattedCountry);
      return NextResponse.json(formattedCountry); // Return the deleted country
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting country:', error.message);
        return NextResponse.json(
          { error: 'Error deleting country', details: error.message },
          { status: 500 }
        );
      } else {
        console.error('Unknown error:', error);
        return NextResponse.json(
          { error: 'Unknown error occurred', details: String(error) },
          { status: 500 }
        );
      }
    }
  }
  
