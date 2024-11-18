'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EditUser() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [form, setForm] = useState({
    name: '',
    surname: '',
    salary: '',
    phone: '',
    cname: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/users?email=${email}`);
        const user = await response.json();
        // Ensure each field has a fallback to prevent undefined values
        setForm({
          name: user.name || '',
          surname: user.surname || '',
          salary: user.salary?.toString() || '', // Convert number to string
          phone: user.phone || '',
          cname: user.cname || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    if (email) fetchUser();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Error: Email is missing. Cannot update user.');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...form,
          salary: Number(form.salary), // Convert salary back to a number before sending
        }),
      });

      if (response.ok) {
        alert('User updated successfully!');
        window.location.href = '/users/main'; // Redirect back to the users list
      } else {
        console.error('Error updating user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Surname"
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Salary"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Country"
            value={form.cname}
            onChange={(e) => setForm({ ...form, cname: e.target.value })}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
    </Suspense>
  );
}
