'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Doctor = {
  email: string;
  degree?: string;
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/doctors'); // Corrected endpoint
        const data: Doctor[] = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading doctors...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Doctor Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/doctors/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Doctor
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Degree</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.email} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{doctor.email}</td>
                  <td className="py-3 px-4">{doctor.degree || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/doctors/edit?email=${doctor.email}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(doctor.email)}
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
          {doctors.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No doctors found. Add a new doctor to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(email: string) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const response = await fetch('/api/doctors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setDoctors(doctors.filter((doctor) => doctor.email !== email));
      } else {
        console.error('Error deleting doctor');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
