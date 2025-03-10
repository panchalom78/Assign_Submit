import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Menu from '../components/Menu';
import CalendarView from '../components/CelenderView';

const Calendar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  const assignments = [
    {
      id: 1,
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      deadline: "2025-03-25",
      status: "Pending",
    },
    {
      id: 2,
      title: "Chemical Reactions Lab",
      subject: "Chemistry",
      deadline: "2025-03-28",
      status: "Deadline Near",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Navbar */}
    <Navbar />

    {/* Main Layout */}
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 gap-6 z-0">
      {/* Sidebar Menu (Sticky on Desktop) */}
      <div className="w-full md:w-64 lg:w-72">
        <div className="sticky top-20 z-10">
          <Menu />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 z-0">
        <CalendarView assignments={assignments} />
      </div>
    </div>
  </div>
  );
};

export default Calendar;