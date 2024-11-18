'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type PublicServant = {
  email: string;
  department?: string;
};

export default function PublicServantsPage() {
  const [publicServants, setPublicServants] = useState<PublicServant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicServants() {
      try {
        const response = await fetch('/api/publicservants');
        const data: PublicServant[] = await response.json(); // Type the fetched data
        setPublicServants(data);
      } catch (error) {
        console.error('Error fetching public servants:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicServants();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading public servants...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Public Servant Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/publicservants/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Public Servant
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publicServants.map((servant) => (
                <tr key={servant.email} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{servant.email}</td>
                  <td className="py-3 px-4">{servant.department || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/publicservants/edit?email=${servant.email}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(servant.email)}
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
          {publicServants.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No public servants found. Add a new public servant to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(email: string) {
    if (!confirm('Are you sure you want to delete this public servant?')) return;

    try {
      const response = await fetch('/api/publicservants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setPublicServants(publicServants.filter((servant) => servant.email !== email));
      } else {
        console.error('Error deleting public servant');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
