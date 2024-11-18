'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Record = {
  email: string;
  cname: string;
  disease_code: string;
  total_deaths?: number | string; // Handle BigInt converted to string
  total_patients?: number | string; // Handle BigInt converted to string
};

export default function RecordsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await fetch('/api/records');
        const data: Record[] = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading records...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Record Management</h1>
        <div className="flex justify-end mb-6">
        <Link href="/">
            <button className="bg-blue-500 text-white py-2 px-4 mx-3 rounded shadow hover:bg-blue-600">
              Back
            </button>
          </Link>
          <Link href="/records/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add Record
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Country Name</th>
                <th className="py-3 px-4">Disease Code</th>
                <th className="py-3 px-4">Total Deaths</th>
                <th className="py-3 px-4">Total Patients</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={`${record.email}-${record.cname}-${record.disease_code}`}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{record.email}</td>
                  <td className="py-3 px-4">{record.cname}</td>
                  <td className="py-3 px-4">{record.disease_code}</td>
                  <td className="py-3 px-4">{record.total_deaths || 'N/A'}</td>
                  <td className="py-3 px-4">{record.total_patients || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/records/edit?email=${record.email}&cname=${record.cname}&disease_code=${record.disease_code}`}
                      >
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(record.email, record.cname, record.disease_code)
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
          {records.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No records found. Add a new record to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(email: string, cname: string, disease_code: string) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cname, disease_code }),
      });

      if (response.ok) {
        setRecords(
          records.filter(
            (record) =>
              !(
                record.email === email &&
                record.cname === cname &&
                record.disease_code === disease_code
              )
          )
        );
      } else {
        console.error('Error deleting record');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
