'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditDisease() {
  const searchParams = useSearchParams();
  const disease_code = searchParams.get('disease_code');
  const [form, setForm] = useState({
    pathogen: '',
    description: '',
    id: '',
  });

  useEffect(() => {
    async function fetchDisease() {
      try {
        const response = await fetch(`/api/diseases?disease_code=${disease_code}`);
        const disease = await response.json();
        setForm({
          pathogen: disease.pathogen || '', // Ensure pathogen is a string
          description: disease.description || '', // Ensure description is a string
          id: disease.id ? disease.id.toString() : '', // Convert id to string for input
        });
      } catch (error) {
        console.error('Error fetching disease:', error);
      }
    }
    if (disease_code) fetchDisease();
  }, [disease_code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!disease_code) {
      alert('Error: Disease code is missing. Cannot update disease.');
      return;
    }

    try {
      const response = await fetch('/api/diseases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease_code,
          pathogen: form.pathogen,
          description: form.description,
          id: form.id ? Number(form.id) : null, // Convert id to number or null
        }),
      });

      if (response.ok) {
        alert('Disease updated successfully!');
        window.location.href = '/diseases'; // Redirect back to the diseases list
      } else {
        console.error('Error updating disease');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Disease</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Update Disease
          </button>
        </form>
      </div>
    </div>
  );
}