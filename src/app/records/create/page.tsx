'use client';

import { useState } from 'react';

export default function CreateRecord() {
  const [form, setForm] = useState({
    email: '',
    cname: '',
    disease_code: '',
    total_deaths: '',
    total_patients: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          total_deaths: form.total_deaths ? Number(form.total_deaths) : null,
          total_patients: form.total_patients ? Number(form.total_patients) : null,
        }),
      });

      if (response.ok) {
        alert('Record added successfully!');
        setForm({
          email: '',
          cname: '',
          disease_code: '',
          total_deaths: '',
          total_patients: '',
        });
        window.location.href = '/records/main'; 
      } else {
        console.error('Error creating record');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Add Record</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
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
            type="number"
            placeholder="Total Deaths"
            value={form.total_deaths}
            onChange={(e) => setForm({ ...form, total_deaths: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Total Patients"
            value={form.total_patients}
            onChange={(e) => setForm({ ...form, total_patients: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Add Record
          </button>
        </form>
      </div>
    </div>
  );
}
