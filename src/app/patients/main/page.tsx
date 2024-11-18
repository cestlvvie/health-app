'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Patient = {
  email: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch('/api/patients');
        const data: Patient[] = await response.json(); // Type the fetched data
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading patients...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Patient Management</h1>
        <div className="flex justify-end mb-6">
        <Link href="/">
            <button className="bg-blue-500 text-white py-2 px-4 mx-3 rounded shadow hover:bg-blue-600">
              Back
            </button>
          </Link>
          <Link href="/patients/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Patient
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.email} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/patients/edit?email=${patient.email}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(patient.email)}
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
          {patients.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No patients found. Add a new patient to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(email: string) {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      const response = await fetch('/api/patients', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setPatients(patients.filter((patient) => patient.email !== email));
      } else {
        console.error('Error deleting patient');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
