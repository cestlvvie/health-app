'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Discover = {
  cname: string;
  disease_code: string;
  first_enc_date?: string; // ISO date string
};

export default function DiscoveriesPage() {
  const [discoveries, setDiscoveries] = useState<Discover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscoveries() {
      try {
        const response = await fetch('/api/discoveries'); // Adjusted endpoint
        const data: Discover[] = await response.json();
        setDiscoveries(data);
      } catch (error) {
        console.error('Error fetching discoveries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiscoveries();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading discoveries...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Discoveries Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/discoveries/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Discovery
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Country Name</th>
                <th className="py-3 px-4">Disease Code</th>
                <th className="py-3 px-4">First Encounter Date</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discoveries.map((discovery) => (
                <tr key={`${discovery.cname}-${discovery.disease_code}`} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{discovery.cname}</td>
                  <td className="py-3 px-4">{discovery.disease_code}</td>
                  <td className="py-3 px-4">{discovery.first_enc_date || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/discoveries/edit?cname=${discovery.cname}&disease_code=${discovery.disease_code}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(discovery.cname, discovery.disease_code)}
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
          {discoveries.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No discoveries found. Add a new discovery to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(cname: string, disease_code: string) {
    if (!confirm(`Are you sure you want to delete the discovery for ${cname} and ${disease_code}?`)) return;

    try {
      const response = await fetch('/api/discoveries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cname, disease_code }),
      });

      if (response.ok) {
        setDiscoveries(discoveries.filter((discovery) => !(discovery.cname === cname && discovery.disease_code === disease_code)));
      } else {
        console.error('Error deleting discovery');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
