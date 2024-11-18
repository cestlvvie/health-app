'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditPublicServant() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [form, setForm] = useState({
    department: '',
  });

  useEffect(() => {
    async function fetchPublicServant() {
      try {
        const response = await fetch(`/api/publicservants?email=${email}`);
        const publicServant = await response.json();
        setForm({
          department: publicServant.department || '',
        });
      } catch (error) {
        console.error('Error fetching public servant:', error);
      }
    }
    if (email) fetchPublicServant();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Error: Email is missing. Cannot update public servant.');
      return;
    }

    try {
      const response = await fetch('/api/publicservants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          department: form.department,
        }),
      });

      if (response.ok) {
        alert('Public Servant updated successfully!');
        window.location.href = '/publicservants'; // Redirect back to the public servants list
      } else {
        console.error('Error updating public servant');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}> 
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit Public Servant</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email || ''}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
            readOnly
          />
          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update Public Servant
          </button>
        </form>
      </div>
    </div>
    </Suspense>
  );
}
