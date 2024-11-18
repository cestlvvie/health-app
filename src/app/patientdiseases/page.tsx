'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type PatientDisease = {
  email: string;
  disease_code: string;
  userName?: string; // Optional field for user name (if needed)
  diseaseName?: string; // Optional field for disease name (if needed)
};

export default function PatientDiseasesPage() {
  const [patientDiseases, setPatientDiseases] = useState<PatientDisease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatientDiseases() {
      try {
        const response = await fetch('/api/patientdiseases');
        const data: PatientDisease[] = await response.json();
        setPatientDiseases(data);
      } catch (error) {
        console.error('Error fetching patient-diseases:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatientDiseases();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading patient-disease associations...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Patient-Disease Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/patientdiseases/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Association
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Disease Code</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientDiseases.map((record) => (
                <tr key={`${record.email}-${record.disease_code}`} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{record.email}</td>
                  <td className="py-3 px-4">{record.disease_code}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/patientdiseases/edit?email=${record.email}&disease_code=${record.disease_code}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(record.email, record.disease_code)}
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
          {patientDiseases.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No patient-disease associations found. Add a new one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(email: string, disease_code: string) {
    if (!confirm('Are you sure you want to delete this association?')) return;

    try {
      const response = await fetch('/api/patientdiseases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, disease_code }),
      });

      if (response.ok) {
        setPatientDiseases(
          patientDiseases.filter((record) => record.email !== email || record.disease_code !== disease_code)
        );
      } else {
        console.error('Error deleting patient-disease association');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
