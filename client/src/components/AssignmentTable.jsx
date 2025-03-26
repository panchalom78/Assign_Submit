import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AssignmentTable = () => {
    const [assignments, setAssignments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const assignmentsPerPage = 5;

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axiosInstance.get(
                    "/student/assignments"
                );
                setAssignments(response.data.assignments);
            } catch (error) {
                console.error("Error fetching assignments:", error);
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

    return (
        <div className="h-auto w-full p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#A560CF]">
                Assignment Table
            </h1>
            <div className="overflow-x-auto px-4 rounded-lg shadow-xl">
                <table className="w-full rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-[#ED739F] to-[#A560CF] text-white">
                        <tr>
                            <th className="px-6 py-4 text-left">No</th>
                            <th className="px-6 py-4 text-left">Title</th>
                            <th className="px-6 py-4 text-left">Due Date</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Marks</th>
                            <th className="px-6 py-4 text-left">Feedback</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentAssignments.map((assignment, index) => (
                            <tr
                                key={assignment.assignmentId}
                                className="hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:scale-105"
                            >
                                <td className="px-6 py-4">
                                    {indexOfFirstAssignment + index + 1}
                                </td>
                                <td className="px-6 py-4">
                                    {assignment.title}
                                </td>
                                <td className="px-6 py-4">
                                    {formatDate(assignment.dueDate)}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm ${
                                            assignment.isSubmitted
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {assignment.isSubmitted
                                            ? "Submitted"
                                            : "Pending"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {assignment.submission?.marks ??
                                        "Not graded"}
                                </td>
                                <td className="px-6 py-4">
                                    {assignment.submission?.feedback ??
                                        "No feedback"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow-sm">
                    <button
                        className="px-4 py-2 text-sm font-medium text-[#A560CF] bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 text-sm font-medium ${
                                currentPage === index + 1
                                    ? "bg-[#A560CF] text-white"
                                    : "text-[#A560CF] bg-white"
                            } border border-gray-300 hover:bg-gray-50`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="px-4 py-2 text-sm font-medium text-[#A560CF] bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default AssignmentTable;
