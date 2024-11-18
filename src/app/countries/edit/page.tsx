'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditCountry() {
  const searchParams = useSearchParams();
  const cname = searchParams.get('cname');
  const [form, setForm] = useState({
    population: '',
  });

  useEffect(() => {
    async function fetchCountry() {
      try {
        const response = await fetch(`/api/countries?cname=${cname}`);
        const country = await response.json();
        // Ensure each field has a fallback to prevent undefined values
        setForm({
          population: country.population?.toString() || '', // Convert BigInt to string
        });
      } catch (error) {
        console.error('Error fetching country:', error);
      }
    }
    if (cname) fetchCountry();
  }, [cname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cname) {
      alert('Error: Country name is missing. Cannot update country.');
      return;
    }

    try {
      const response = await fetch('/api/countries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cname,
          population: form.population ? Number(form.population) : null, // Convert population back to a number before sending
        }),
      });

      if (response.ok) {
        alert('Country updated successfully!');
        window.location.href = '/countries'; // Redirect back to the countries list
      } else {
        console.error('Error updating country');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Suspense> 
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Country</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Population"
            value={form.population}
            onChange={(e) => setForm({ ...form, population: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update Country
          </button>
        </form>
      </div>
    </div>
    </Suspense>
  );
}
