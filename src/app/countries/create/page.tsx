'use client';

import { useState } from 'react';

export default function CreateCountry() {
  const [form, setForm] = useState({
    cname: '',
    population: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          population: form.population ? Number(form.population) : null, // Convert to number or null
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating country:', errorData);
        alert(`Error: ${errorData.error || 'Something went wrong'}`);
        return;
      }
  
      const data = await response.json();
      alert('Country added successfully!');
      setForm({
        cname: '',
        population: '',
      });
      console.log('Created country:', data);
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Add Country</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Country Name"
            value={form.cname}
            onChange={(e) => setForm({ ...form, cname: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Population"
            value={form.population}
            onChange={(e) => setForm({ ...form, population: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Add Country
          </button>
        </form>
      </div>
    </div>
  );
}
