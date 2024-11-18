'use client';

import { useState } from 'react';

export default function CreateSpecialization() {
  const [form, setForm] = useState({
    id: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/specializations', { // Adjusted endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id ? Number(form.id) : undefined, // Convert id to number
          email: form.email,
        }),
      });

      if (response.ok) {
        alert('Specialization added successfully!');
        setForm({
          id: '',
          email: '',
        });
      } else {
        console.error('Error creating specialization');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Add Specialization</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Disease Type ID"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Doctor Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Add Specialization
          </button>
        </form>
      </div>
    </div>
  );
}
