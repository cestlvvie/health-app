'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function EditDiseaseType() {
  const [id, setId] = useState('');
  const [form, setForm] = useState({
    description: '',
  });

  useEffect(() => {
    // Extract the id query parameter using URLSearchParams
    const searchParams = new URLSearchParams(window.location.search);
    const idParam = searchParams.get('id') || '';
    setId(idParam);

    // Fetch the disease type data if id is present
    if (idParam) {
      async function fetchDiseaseType() {
        try {
          const response = await fetch(`/api/diseasetypes?id=${idParam}`);
          const diseaseType = await response.json();
          setForm({
            description: diseaseType.description || '', // Ensure description is a string
          });
        } catch (error) {
          console.error('Error fetching disease type:', error);
        }
      }
      fetchDiseaseType();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      alert('Error: Disease Type ID is missing. Cannot update disease type.');
      return;
    }

    try {
      const response = await fetch('/api/diseasetypes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(id), // Convert id to number
          description: form.description,
        }),
      });

      if (response.ok) {
        alert('Disease type updated successfully!');
        window.location.href = '/diseasetypes/main'; // Redirect back to the disease types list
      } else {
        console.error('Error updating disease type');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Disease Type</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update Disease Type
          </button>
        </form>
      </div>
    </div>
  );
}
