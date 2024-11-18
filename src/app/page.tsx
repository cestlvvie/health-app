'use client';

import Link from 'next/link';

export default function MainPage() {
  const pages = [
    { name: 'Countries', route: '/countries' },
    { name: 'Discoveries', route: '/discoveries' },
    { name: 'Diseases', route: '/diseases' },
    { name: 'Disease Types', route: '/diseasetypes' },
    { name: 'Doctors', route: '/doctors' },
    { name: 'Patient Diseases', route: '/patientdiseases' },
    { name: 'Patients', route: '/patients' },
    { name: 'Public Servants', route: '/publicservants' },
    { name: 'Records', route: '/records' },
    { name: 'Specializations', route: '/specializations' },
    { name: 'Users', route: '/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-12">Database Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Link href={page.route} key={page.name}>
            <button className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-lg hover:bg-blue-600">
              {page.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
