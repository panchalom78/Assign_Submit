import React from 'react';

const AssignmentTable = () => {
  return (
    <div className="h-auto w-full p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#A560CF]">Assignment Table</h1>
      <div className="overflow-x-auto px-4 rounded-lg shadow-xl">
        <table className="w-full rounded-lg  overflow-hidden">
          <thead className="bg-gradient-to-r from-[#ED739F] to-[#A560CF] text-white">
            <tr>
              <th className="px-6 py-4 text-left">No</th>
              <th className="px-6 py-4 text-left">Time</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">Assignment Title</th>
              <th className="px-6 py-4 text-left">Teacher Name</th>
              <th className="px-6 py-4 text-left">Last Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-all duration-200 ease-in-out  transform hover:scale-105"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">10:00 AM</td>
                <td className="px-6 py-4">Math</td>
                <td className="px-6 py-4">Algebra Worksheet</td>
                <td className="px-6 py-4">Mr. Sharma</td>
                <td className="px-6 py-4">2025-02-20</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md shadow-sm">
          <button className="px-4 py-2 text-sm font-medium text-[#A560CF] bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#A560CF] bg-white border border-gray-300 hover:bg-gray-50">
            1
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#A560CF] bg-white border border-gray-300 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#A560CF] bg-white border border-gray-300 hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#A560CF] bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AssignmentTable;