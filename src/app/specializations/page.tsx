'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Specialization = {
  id: number;
  email: string;
  doctor: { email: string }; // Nested doctor relation
  diseasetype: { id: number; description: string }; // Nested diseasetype relation
};

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecializations() {
      try {
        const response = await fetch('/api/specializations');
        const data: Specialization[] = await response.json();
        setSpecializations(data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpecializations();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading specializations...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Specialization Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/specializations/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Specialization
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Doctor Email</th>
                <th className="py-3 px-4">Disease Type</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specializations.map((specialization) => (
                <tr
                  key={`${specialization.id}-${specialization.email}`}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{specialization.id}</td>
                  <td className="py-3 px-4">{specialization.email}</td>
                  <td className="py-3 px-4">{specialization.diseasetype.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                       
                      <button
                        onClick={() =>
                          handleDelete(specialization.id, specialization.email)
                        }
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {specializations.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No specializations found. Add a new one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(id: number, email: string) {
    if (!confirm('Are you sure you want to delete this specialization?')) return;

    try {
      const response = await fetch('/api/specializations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email }),
      });

      if (response.ok) {
        setSpecializations(
          specializations.filter(
            (specialization) => specialization.id !== id || specialization.email !== email
          )
        );
      } else {
        console.error('Error deleting specialization');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
