import React from 'react';

function home() {
  return (
<> 
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-gray-900 text-white">
        <div className="px-4 py-6">
          <h2 className="text-3xl font-semibold">Dashboard</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="px-4 py-2 hover:bg-gray-700 rounded">
            <i className="fas fa-home mr-3"></i>Dashboard
          </a>
          <a href="#" className="px-4 py-2 hover:bg-gray-700 rounded">
            <i className="fas fa-users mr-3"></i>Team
          </a>
          <a href="#" className="px-4 py-2 hover:bg-gray-700 rounded">
            <i className="fas fa-folder mr-3"></i>Projects
          </a>
          <a href="#" className="px-4 py-2 hover:bg-gray-700 rounded">
            <i className="fas fa-calendar-alt mr-3"></i>Calendar
          </a>
          <a href="#" className="px-4 py-2 hover:bg-gray-700 rounded">
            <i className="fas fa-file-alt mr-3"></i>Documents
          </a>
          <a href="#" className="px-4 py-2 hover:bg-gray-700 rounded">
            <i className="fas fa-chart-line mr-3"></i>Reports
          </a>
        </nav>
        <div className="mt-auto px-4 py-6">
          <h3 className="text-gray-400 mb-2">Your teams</h3>
          <a href="#" className="block mb-2 text-gray-300 hover:bg-gray-700 rounded px-4 py-2">
            <span className="text-gray-400">H</span> Heroicons
          </a>
          <a href="#" className="block mb-2 text-gray-300 hover:bg-gray-700 rounded px-4 py-2">
            <span className="text-gray-400">T</span> Tailwind Labs
          </a>
          <a href="#" className="block text-gray-300 hover:bg-gray-700 rounded px-4 py-2">
            <span className="text-gray-400">W</span> Workcation
          </a>
        </div>
        <div className="px-4 py-6">
          <a href="#" className="flex items-center text-gray-300 hover:bg-gray-700 rounded px-4 py-2">
            <i className="fas fa-cog mr-3"></i>Settings
          </a>
        </div>
      </div>
    
      {/* Main Content */}
      <div className="flex-grow">
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center">
            <i className="fas fa-bell text-gray-600 mr-6"></i>
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://via.placeholder.com/150"
                alt="User profile"
              />
              <span className="ml-3 text-gray-700">Tom Cook</span>
            </div>
          </div>
        </header>
        <main className="bg-white p-6 h-full">
          <div className="h-full w-full bg-gray-200 rounded-lg border-dashed border-4 border-gray-300"></div>
        </main>
      </div>
    </div>
</>
  );
}

export default home;