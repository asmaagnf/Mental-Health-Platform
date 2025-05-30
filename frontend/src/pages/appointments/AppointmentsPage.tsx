import React from 'react';

function AppointmentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Appointments</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            <p className="text-gray-600">No upcoming appointments scheduled.</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Appointments</h2>
          <div className="space-y-4">
            <p className="text-gray-600">No past appointments found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentsPage;