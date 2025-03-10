import React from 'react';
import CalendarView from '../components/CelenderView'; // Ensure the correct import path

const Features = () => {
  
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assignment Calendar</h1>
      <CalendarView assignments={assignments} />
    </div>
  );
};

export default Features;