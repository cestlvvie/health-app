'use client';

import Link from 'next/link';

export default function MainPage() {
  const pages = [
    { name: 'Countries', route: '/countries/main' },
    { name: 'Discoveries', route: '/discoveries/main' },
    { name: 'Diseases', route: '/diseases/main' },
    { name: 'Disease Types', route: '/diseasetypes/main' },
    { name: 'Doctors', route: '/doctors/main' },
    { name: 'Patient Diseases', route: '/patientdiseases/main' },
    { name: 'Patients', route: '/patients/main' },
    { name: 'Public Servants', route: '/publicservants/main' },
    { name: 'Records', route: '/records/main' },
    { name: 'Specializations', route: '/specializations/main' },
    { name: 'Users', route: '/users/main' },
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
