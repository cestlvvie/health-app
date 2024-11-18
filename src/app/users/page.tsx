'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  email: string;
  name: string;
  surname: string;
  salary: number;
  phone: string;
  cname: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]); // Type the users state as an array of User
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        const data: User[] = await response.json(); // Type the fetched data
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center text-xl mt-8">Loading users...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">User Management</h1>
        <div className="flex justify-end mb-6">
          <Link href="/users/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
              Add User
            </button>
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email || ''} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {user.name || ''} {user.surname || ''}
                  </td>
                  <td className="py-3 px-4">{user.email || ''}</td>
                  <td className="py-3 px-4">{user.phone || ''}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link href={`/users/edit?email=${user.email || ''}`}>
                        <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(user.email || '')}
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
          {users.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No users found. Add a new user to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleDelete(email: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.email !== email));
      } else {
        console.error('Error deleting user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
