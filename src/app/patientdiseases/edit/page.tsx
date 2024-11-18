'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function EditPatientDisease() {
  const [params, setParams] = useState({ email: '', disease_code: '' });
  const [form, setForm] = useState({
    disease_code: '',
  });

  useEffect(() => {
    // Extract email and disease_code from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email') || '';
    const diseaseCodeParam = searchParams.get('disease_code') || '';

    setParams({ email: emailParam, disease_code: diseaseCodeParam });

    // Fetch patient-disease data if both email and disease_code exist
    if (emailParam && diseaseCodeParam) {
      async function fetchPatientDisease() {
        try {
          const response = await fetch(`/api/patientdiseases?email=${emailParam}&disease_code=${diseaseCodeParam}`);
          const patientDisease = await response.json();
          setForm({
            disease_code: patientDisease.disease_code || '',
          });
        } catch (error) {
          console.error('Error fetching patient-disease association:', error);
        }
      }
      fetchPatientDisease();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, disease_code } = params;

    if (!email || !disease_code) {
      alert('Error: Email or Disease Code is missing. Cannot update association.');
      return;
    }

    try {
      const response = await fetch('/api/patientdiseases/main', {
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
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Edit Patient-Disease Association
        </h1>
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
