'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditPatientDisease() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const disease_code = searchParams.get('disease_code');
  const [form, setForm] = useState({
    disease_code: '',
  });

  useEffect(() => {
    async function fetchPatientDisease() {
      try {
        const response = await fetch(`/api/patientdiseases?email=${email}&disease_code=${disease_code}`);
        const patientDisease = await response.json();
        setForm({
          disease_code: patientDisease.disease_code || '',
        });
      } catch (error) {
        console.error('Error fetching patient-disease association:', error);
      }
    }

    if (email && disease_code) fetchPatientDisease();
  }, [email, disease_code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !disease_code) {
      alert('Error: Email or Disease Code is missing. Cannot update association.');
      return;
    }

    try {
      const response = await fetch('/api/patientdiseases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          disease_code, // Current disease_code (identifier)
          new_disease_code: form.disease_code, // Updated disease_code
        }),
      });

      if (response.ok) {
        alert('Patient-Disease association updated successfully!');
        window.location.href = '/patientdiseases'; // Redirect back to the list
      } else {
        console.error('Error updating association');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Patient-Disease Association</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Disease Code"
            value={form.disease_code}
            onChange={(e) => setForm({ ...form, disease_code: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update Association
          </button>
        </form>
      </div>
    </div>
  );
}
