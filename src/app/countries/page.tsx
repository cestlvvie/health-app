'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Country = {
  cname: string;
  population: number | null; // Population can be nullable
};

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]); // Type the countries state as an array of Country
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch('/api/countries');
        const data: Country[] = await response.json(); // Type the fetched data
        setCountries(
          data.map((country) => ({
            ...country,
            population: country.population || null, // Ensure population is null if undefined
          }))
        );
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading countries...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Country Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/countries/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Country
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Country Name</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country.cname || ''} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{country.cname || ''}</td>
                  <td className="py-3 px-4">{country.population?.toLocaleString() || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/countries/edit?cname=${country.cname || ''}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(country.cname || '')}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {countries.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No countries found. Add a new country to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(cname: string) {
    if (!confirm('Are you sure you want to delete this country?')) return;

    try {
      const response = await fetch('/api/countries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cname }),
      });

      if (response.ok) {
        setCountries(countries.filter((country) => country.cname !== cname));
      } else {
        console.error('Error deleting country');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
