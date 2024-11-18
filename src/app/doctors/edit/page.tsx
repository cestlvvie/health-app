'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditDoctor() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [form, setForm] = useState({
    degree: '',
  });

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const response = await fetch(`/api/doctors?email=${email}`);
        const doctor = await response.json();
        // Ensure each field has a fallback to prevent undefined values
        setForm({
          degree: doctor.degree || '',
        });
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    }
    if (email) fetchDoctor();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Error: Email is missing. Cannot update doctor.');
      return;
    }

    try {
      const response = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...form,
        }),
      });

      if (response.ok) {
        alert('Doctor updated successfully!');
        window.location.href = '/doctors'; // Redirect back to the doctors list
      } else {
        console.error('Error updating doctor');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}> 
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Doctor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Degree"
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update Doctor
          </button>
        </form>
      </div>
    </div>
    </Suspense>
  );
}
