'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function EditDoctor() {
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    degree: '',
  });

  useEffect(() => {
    // Extract email from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email') || '';
    setEmail(emailParam);

    // Fetch the doctor's data if email exists
    if (emailParam) {
      async function fetchDoctor() {
        try {
          const response = await fetch(`/api/doctors?email=${emailParam}`);
          const doctor = await response.json();
          setForm({
            degree: doctor.degree || '', // Ensure degree is a string
          });
        } catch (error) {
          console.error('Error fetching doctor:', error);
        }
      }
      fetchDoctor();
    }
  }, []);

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
        window.location.href = '/doctors/main'; // Redirect back to the doctors list
      } else {
        console.error('Error updating doctor');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
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
  );
}
