import React from 'react';

function Home() {
  return (
    <>
      <div className="flex h-screen bg-gray-100 ">
        {/* Sidebar */}
        <div className="flex flex-col w-64 bg-blue-600 h-full fixed">
          <div className="flex items-center justify-center h-16 text-white text-2xl font-bold">
            <span className="text-3xl">🌊</span> {/* Logo */}
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {/* Navigation items */}
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">home</span>
              <span className="ml-3">Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">group</span>
              <span className="ml-3">Team</span>
            </a>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">folder</span>
              <span className="ml-3">Projects</span>
            </a>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">calendar_today</span>
              <span className="ml-3">Calendar</span>
            </a>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">description</span>
              <span className="ml-3">Documents</span>
            </a>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">bar_chart</span>
              <span className="ml-3">Reports</span>
            </a>
          </nav>
          <div className="px-2 py-4 space-y-1">
            <span className="text-sm text-white font-semibold px-2">Your teams</span>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">h</span>
              <span className="ml-3">Heroicons</span>
            </a>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">t</span>
              <span className="ml-3">Tailwind Labs</span>
            </a>
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">w</span>
              <span className="ml-3">Workcation</span>
            </a>
          </div>
          <div className="px-2 py-4">
            <a
              href="#"
              className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700"
            >
              <span className="material-icons">settings</span>
              <span className="ml-3">Settings</span>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 w-0 ml-64">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-4 bg-white shadow-md">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border rounded-md focus:outline-none"
              />
            </div>
            <div className="flex items-center">
              <button className="relative">
                <span className="material-icons">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <div className="ml-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2">Tom Cook</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <main className="flex-1 bg-gray-50">
            <div className="p-6">
              <p className="text-gray-500">Your content goes here...</p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Home;
