import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";

// Color Palette Constants
const COLORS = {
  primary: '#EB3678',       // Vibrant pink
  secondary: '#FB773C',     // Orange
  accent: '#A560CF',        // Purple
  darkBg: '#1F1F1F',        // Dark background
  lightBg: '#2D2D2D',       // Light background
  textPrimary: '#FFFFFF',   // White text
  textSecondary: '#E5E5E5', // Light gray text
  success: '#10B981',       // Green
  warning: '#F59E0B',       // Yellow
  error: '#EF4444',         // Red
};

// Common Gradients
const GRADIENTS = {
  main: 'bg-[#FB773C]',
  secondary: 'bg-gradient-to-r from-[#ED739F] to-[#A560CF]',
};

// Common Shadows
const SHADOWS = {
  button: 'shadow-lg hover:shadow-xl',
  card: 'shadow-md',
};

const AssignmentTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const assignmentsPerPage = 5;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/student/assignments");
        setAssignments(response.data.assignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Calculate pagination
  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = assignments.slice(
    indexOfFirstAssignment,
    indexOfLastAssignment
  );
  const totalPages = Math.ceil(assignments.length / assignmentsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A560CF]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full p-6 bg-[#1F1F1F] min-h-[400px]"
    >
      <h1
        className={`text-xl text-white  font-bold mb-6 text-center  bg-clip-text `}
      >
        Recent Assignments
      </h1>

      {/* Table Wrapper */}
      <div
        className={`overflow-x-auto rounded-xl ${SHADOWS.card} border border-[${COLORS.primary}]/20 max-w-full`}
        role="region"
        aria-label="Assignments table"
      >
        <table className="w-full table-auto">
          <thead className={GRADIENTS.main}>
            <tr>
              {['#', 'Assignment', 'Due Date', 'Status', 'Score', 'Feedback'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-black font-semibold text-sm md:text-base"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className={`bg-[${COLORS.lightBg}] divide-y divide-[${COLORS.primary}]/10`}>
            {currentAssignments.length > 0 ? (
              currentAssignments.map((assignment, index) => (
                <motion.tr
                  key={assignment.assignmentId}
                  whileHover={{ backgroundColor: `${COLORS.primary}10` }}
                  transition={{ duration: 0.2 }}
                  className="transition-colors duration-200"
                >
                  <td className={`px-6 py-4 text-white text-sm md:text-base`}>
                    {indexOfFirstAssignment + index + 1}
                  </td>
                  <td
                    className={`px-6 py-4 font-medium text-white text-sm md:text-base truncate max-w-[200px]`}
                    title={assignment.title}
                  >
                    {assignment.title}
                  </td>
                  <td className={`px-6 py-4 text-white text-sm md:text-base`}>
                    {formatDate(assignment.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[${COLORS.textPrimary}] text-sm font-semibold ${
                        assignment.isSubmitted
                          ? `bg-green-100 text-green-800`
                          : `bg-red-100 text-red-800`
                      }`}
                    >
                      {assignment.isSubmitted ? 'Submitted' : 'Pending'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-white text-sm md:text-base`}>
                    {assignment.submission?.marks ?? '-'}
                  </td>
                  <td
                    className={`px-6 py-4 text-white text-sm md:text-base truncate max-w-[200px]`}
                    title={assignment.submission?.feedback ?? 'None'}
                  >
                    {assignment.submission?.feedback ?? 'None'}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className={`px-6 py-8 text-center text-[${COLORS.textPrimary}] text-sm md:text-base`}
                >
                  No assignments currently available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {assignments.length > 0 && (
        <div className="flex justify-center mt-6">
          <nav
            className="inline-flex rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md border border-[${COLORS.accent}] ${
                currentPage === 1
                  ? `bg-gray-100 text-gray-400 cursor-not-allowed`
                  : `bg-[${COLORS.lightBg}] text-[${COLORS.accent}] hover:bg-[${COLORS.primary}]/10`
              } focus:outline-none focus:ring-2 focus:ring-[${COLORS.primary}]`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-sm font-medium border-t border-b border-[${COLORS.accent}] ${
                  currentPage === index + 1
                    ? `${GRADIENTS.main} text-white`
                    : `bg-[${COLORS.lightBg}] text-[${COLORS.accent}] hover:bg-[${COLORS.primary}]/10`
                } focus:outline-none focus:ring-2 focus:ring-[${COLORS.primary}]`}
                onClick={() => setCurrentPage(index + 1)}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md border border-[${COLORS.accent}] ${
                currentPage === totalPages
                  ? `bg-gray-100 text-gray-400 cursor-not-allowed`
                  : `bg-[${COLORS.lightBg}] text-[${COLORS.accent}] hover:bg-[${COLORS.primary}]/10`
              } focus:outline-none focus:ring-2 focus:ring-[${COLORS.primary}]`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </motion.div>
  );
};

export default AssignmentTable; 