'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditPatient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [form, setForm] = useState({
    email: '',
  });

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(`/api/patients?email=${email}`);
        const patient = await response.json();
        setForm({
          email: patient.email || '',
        });
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    }
    if (email) fetchPatient();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Error: Email is missing. Cannot update patient.');
      return;
    }

    try {
      const response = await fetch('/api/patients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        alert('Patient updated successfully!');
        window.location.href = '/patients'; // Redirect back to the patients list
      } else {
        console.error('Error updating patient');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Patient</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
            readOnly
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update Patient
          </button>
        </form>
      </div>
    </div>
  );
}
