'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DiseaseType = {
  id: number;
  description: string | null; // Description can be nullable
};

export default function DiseaseTypesPage() {
  const [diseaseTypes, setDiseaseTypes] = useState<DiseaseType[]>([]); // Type the diseaseTypes state as an array of DiseaseType
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiseaseTypes() {
      try {
        const response = await fetch('/api/diseasetypes');
        const data: DiseaseType[] = await response.json(); // Type the fetched data
        setDiseaseTypes(
          data.map((type) => ({
            ...type,
            description: type.description || 'No description', // Ensure description is set to a fallback value
          }))
        );
      } catch (error) {
        console.error('Error fetching disease types:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiseaseTypes();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading disease types...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Disease Type Management</h1>
        <div className="flex justify-end mb-6">
        <Link href="/">
            <button className="bg-blue-500 text-white py-2 px-4 mx-3 rounded shadow hover:bg-blue-600">
              Back
            </button>
          </Link>
          <Link href="/diseasetypes/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Disease Type
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseaseTypes.map((type) => (
                <tr key={type.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{type.id}</td>
                  <td className="py-3 px-4">{type.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/diseasetypes/edit?id=${type.id}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(type.id)}
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
          {diseaseTypes.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No disease types found. Add a new disease type to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this disease type?')) return;

    try {
      const response = await fetch('/api/diseasetypes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setDiseaseTypes(diseaseTypes.filter((type) => type.id !== id));
      } else {
        console.error('Error deleting disease type');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
