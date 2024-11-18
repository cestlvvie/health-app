'use client';

import { useState } from 'react';

export default function CreateDisease() {
  const [form, setForm] = useState({
    disease_code: '',
    pathogen: '',
    description: '',
    id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/diseases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          id: form.id ? Number(form.id) : undefined, // Convert ID to number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating disease:', errorData);
        alert(`Error: ${errorData.error || 'Something went wrong'}`);
        return;
      }

      const data = await response.json();
      alert('Disease added successfully!');
      setForm({
        disease_code: '',
        pathogen: '',
        description: '',
        id: '',
      });
      console.log('Created disease:', data);
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Add Disease</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Disease Code"
            value={form.disease_code}
            onChange={(e) => setForm({ ...form, disease_code: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Pathogen"
            value={form.pathogen}
            onChange={(e) => setForm({ ...form, pathogen: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Disease Type ID"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Add Disease
          </button>
        </form>
      </div>
    </div>
  );
}
