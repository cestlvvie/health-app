'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Disease = {
  disease_code: string;
  pathogen: string | null;
  description: string | null;
  id: number | null;
};

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiseases() {
      try {
        const response = await fetch('/api/diseases');
        const data: Disease[] = await response.json();
        setDiseases(
          data.map((disease) => ({
            ...disease,
            pathogen: disease.pathogen || 'Unknown pathogen',
            description: disease.description || 'No description',
          }))
        );
      } catch (error) {
        console.error('Error fetching diseases:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiseases();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading diseases...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Disease Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/diseases/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Disease
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Disease Code</th>
                <th className="py-3 px-4">Pathogen</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type ID</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((disease) => (
                <tr key={disease.disease_code} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{disease.disease_code}</td>
                  <td className="py-3 px-4">{disease.pathogen}</td>
                  <td className="py-3 px-4">{disease.description}</td>
                  <td className="py-3 px-4">{disease.id || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/diseases/edit?disease_code=${disease.disease_code}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(disease.disease_code)}
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
          {diseases.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No diseases found. Add a new disease to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(disease_code: string) {
    if (!confirm('Are you sure you want to delete this disease?')) return;

    try {
      const response = await fetch('/api/diseases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease_code }),
      });

      if (response.ok) {
        setDiseases(diseases.filter((disease) => disease.disease_code !== disease_code));
      } else {
        console.error('Error deleting disease');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
