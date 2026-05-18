import { useState } from 'react';
import CourseManager from '../components/admin/CourseManager';
import RegistrationManager from '../components/admin/RegistrationManager';

function AdminDashboard() {
  const [tab, setTab] = useState('courses');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 border-b border-gray-700 mb-6">
        <TabButton active={tab === 'courses'} onClick={() => setTab('courses')}>
          Courses
        </TabButton>
        <TabButton active={tab === 'registrations'} onClick={() => setTab('registrations')}>
          Registrations
        </TabButton>
      </div>

      {tab === 'courses' && <CourseManager />}
      {tab === 'registrations' && <RegistrationManager />}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold border-b-2 -mb-px transition ${
        active
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export default AdminDashboard;