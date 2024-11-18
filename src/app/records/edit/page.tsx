'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditRecord() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const cname = searchParams.get('cname');
  const disease_code = searchParams.get('disease_code');

  const [form, setForm] = useState({
    total_deaths: '',
    total_patients: '',
  });

  useEffect(() => {
    async function fetchRecord() {
      try {
        const response = await fetch(
          `/api/records?email=${email}&cname=${cname}&disease_code=${disease_code}`
        );
        const record = await response.json();
        setForm({
          total_deaths: record.total_deaths?.toString() || '',
          total_patients: record.total_patients?.toString() || '',
        });
      } catch (error) {
        console.error('Error fetching record:', error);
      }
    }
    if (email && cname && disease_code) fetchRecord();
  }, [email, cname, disease_code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !cname || !disease_code) {
      alert('Error: Missing composite key fields. Cannot update record.');
      return;
    }

    try {
      const response = await fetch('/api/records', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cname,
          disease_code,
          total_deaths: form.total_deaths ? Number(form.total_deaths) : null,
          total_patients: form.total_patients ? Number(form.total_patients) : null,
        }),
      });

      if (response.ok) {
        alert('Record updated successfully!');
        window.location.href = '/records/main'; // Redirect back to the records list
      } else {
        console.error('Error updating record');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}> 
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Record</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Update Record
          </button>
        </form>
      </div>
    </div>
    </Suspense>
  );
}
