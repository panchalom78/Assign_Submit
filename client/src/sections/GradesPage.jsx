import React from 'react';
import Navbar from '../components/Navbar';
import Menu from '../components/Menu';
import Grade from '../components/Grade';

const GradesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 gap-6">
        {/* Sidebar Menu (Sticky on Desktop) */}
        <div className="w-full md:w-64 lg:w-72">
          <div className="sticky top-20">
            <Menu />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Grade />
        </div>
      </div>
    </div>
  );
};

export default GradesPage;