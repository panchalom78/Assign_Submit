import React, { useState } from 'react';

const Grade = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sample data for submitted assignments
  const assignments = [
    {
      id: 1,
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      submittedOn: "2024-03-10",
      status: "Graded",
      grade: "A",
    },
    {
      id: 2,
      title: "Chemical Reactions Lab",
      subject: "Chemistry",
      submittedOn: "2024-03-15",
      status: "Pending",
      grade: "-",
    },
    {
      id: 3,
      title: "History Essay",
      subject: "History",
      submittedOn: "2024-03-20",
      status: "Graded",
      grade: "B+",
    },
  ];

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort assignments
  const sortedAssignments = React.useMemo(() => {
    if (sortConfig.key) {
      return [...filteredAssignments].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredAssignments;
  }, [filteredAssignments, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-purple-600 mb-6 text-center">
        Grades
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Grades Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#ED739F] to-[#A560CF] text-white">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => requestSort('title')}
              >
                Title
              </th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => requestSort('subject')}
              >
                Subject
              </th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => requestSort('submittedOn')}
              >
                Submitted On
              </th>
              <th className="px-4 py-3">Status</th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => requestSort('grade')}
              >
                Grade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedAssignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center">{assignment.title}</td>
                <td className="px-4 py-3 text-center">{assignment.subject}</td>
                <td className="px-4 py-3 text-center">{assignment.submittedOn}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      assignment.status === 'Graded'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`font-semibold ${
                      assignment.grade === 'A'
                        ? 'text-green-600'
                        : assignment.grade === 'B+'
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {assignment.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grade;