import { useState } from "react";
import Sidebar from './Sidebar';  // Make sure this is default export
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/allPlaces': 'All Places',
  '/allActivities': 'All Activities',
  '/serviceProviders': 'Service Providers',
  '/accommodationProviders': 'Accommodation Providers',
  '/settings': 'Settings',
  '/logout': 'Logout',
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900"></h1>
          <div className="text-sm text-gray-500">
            Welcome to HolidayNepal Admin
          </div>
        </header>

        {/* Render current page here */}
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
