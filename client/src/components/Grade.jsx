import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Grade = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axiosInstance.get(
                    "/student/assignments"
                );
                setAssignments(response.data.assignments);
            } catch (error) {
                console.error("Error fetching assignments:", error);
                toast.error("Failed to load assignments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    // Filter assignments based on search query
    const filteredAssignments = assignments.filter(
        (assignment) =>
            assignment.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            assignment.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    // Sort assignments
    const sortedAssignments = React.useMemo(() => {
        if (sortConfig.key) {
            return [...filteredAssignments].sort((a, b) => {
                if (
                    sortConfig.key === "dueDate" ||
                    sortConfig.key === "submittedOn"
                ) {
                    const dateA = new Date(a[sortConfig.key] || 0);
                    const dateB = new Date(b[sortConfig.key] || 0);
                    return sortConfig.direction === "asc"
                        ? dateA - dateB
                        : dateB - dateA;
                }
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredAssignments;
    }, [filteredAssignments, sortConfig]);

    // Handle sorting
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getStatus = (assignment) => {
        if (!assignment.isSubmitted) return "Not Submitted";
        if (assignment.submission?.marks !== null) return "Graded";
        return "Submitted";
    };

    const getGrade = (assignment) => {
        if (!assignment.submission || assignment.submission.marks === null)
            return "-";
        const marks = assignment.submission.marks;
        if (marks >= 9) return "A";
        if (marks >= 8) return "B+";
        if (marks >= 7) return "B";
        if (marks >= 6) return "C";
        return "F";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

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
                                onClick={() => requestSort("title")}
                            >
                                Title
                            </th>
                            <th
                                className="px-4 py-3 cursor-pointer"
                                onClick={() => requestSort("description")}
                            >
                                Description
                            </th>
                            <th
                                className="px-4 py-3 cursor-pointer"
                                onClick={() => requestSort("dueDate")}
                            >
                                Due Date
                            </th>
                            <th
                                className="px-4 py-3 cursor-pointer"
                                onClick={() => requestSort("submittedOn")}
                            >
                                Submitted On
                            </th>
                            <th className="px-4 py-3">Status</th>
                            <th
                                className="px-4 py-3 cursor-pointer"
                                onClick={() => requestSort("submission.marks")}
                            >
                                Grade
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedAssignments.map((assignment) => (
                            <tr
                                key={assignment.assignmentId}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-3 text-center">
                                    {assignment.title}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {assignment.description}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {formatDate(assignment.dueDate)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {formatDate(
                                        assignment.submission?.submissionDate
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            getStatus(assignment) === "Graded"
                                                ? "bg-green-100 text-green-600"
                                                : getStatus(assignment) ===
                                                  "Submitted"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {getStatus(assignment)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`font-semibold ${
                                            getGrade(assignment) === "A"
                                                ? "text-green-600"
                                                : getGrade(assignment) === "B+"
                                                ? "text-blue-600"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {getGrade(assignment)}
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
