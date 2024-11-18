'use client';

import { useState } from 'react';

export default function CreateDiscovery() {
  const [form, setForm] = useState({
    cname: '',
    disease_code: '',
    first_enc_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/discoveries', { // Adjusted endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          first_enc_date: form.first_enc_date ? new Date(form.first_enc_date).toISOString() : null, // Ensure valid date
        }),
      });

      if (response.ok) {
        alert('Discovery added successfully!');
        setForm({
          cname: '',
          disease_code: '',
          first_enc_date: '',
        });
      } else {
        console.error('Error creating discovery');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Add Discovery</h1>
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
            type="text"
            placeholder="Disease Code"
            value={form.disease_code}
            onChange={(e) => setForm({ ...form, disease_code: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            placeholder="First Encounter Date"
            value={form.first_enc_date}
            onChange={(e) => setForm({ ...form, first_enc_date: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Add Discovery
          </button>
        </form>
      </div>
    </div>
  );
}
