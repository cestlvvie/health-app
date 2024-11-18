'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function EditDiscovery() {
  const [params, setParams] = useState({ cname: '', disease_code: '' });
  const [form, setForm] = useState({
    first_enc_date: '',
  });

  useEffect(() => {
    // Get query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const cname = searchParams.get('cname') || '';
    const disease_code = searchParams.get('disease_code') || '';

    setParams({ cname, disease_code });

    // Fetch discovery data if both parameters are present
    if (cname && disease_code) {
      async function fetchDiscovery() {
        try {
          const response = await fetch(
            `/api/discoveries?cname=${cname}&disease_code=${disease_code}`
          );
          const discovery = await response.json();
          setForm({
            first_enc_date: discovery.first_enc_date
              ? new Date(discovery.first_enc_date).toISOString().split('T')[0]
              : '',
          });
        } catch (error) {
          console.error('Error fetching discovery:', error);
        }
      }
      fetchDiscovery();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { cname, disease_code } = params;

    if (!cname || !disease_code) {
      alert('Error: Country name or disease code is missing. Cannot update discovery.');
      return;
    }

    try {
      const response = await fetch('/api/discoveries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cname,
          disease_code,
          first_enc_date: form.first_enc_date
            ? new Date(form.first_enc_date).toISOString()
            : null,
        }),
      });

      if (response.ok) {
        alert('Discovery updated successfully!');
        window.location.href = '/discoveries/main'; // Redirect back to the discoveries list
      } else {
        console.error('Error updating discovery');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Edit Discovery
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            placeholder="First Encounter Date"
            value={form.first_enc_date}
            onChange={(e) => setForm({ ...form, first_enc_date: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update Discovery
          </button>
        </form>
      </div>
    </div>
  );
}
