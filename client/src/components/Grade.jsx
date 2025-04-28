import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
                setIsLoading(true);
                const response = await axiosInstance.get("/student/assignments");
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
            assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort assignments
    const sortedAssignments = React.useMemo(() => {
        if (sortConfig.key) {
            return [...filteredAssignments].sort((a, b) => {
                if (sortConfig.key === "dueDate" || sortConfig.key === "submittedOn") {
                    const dateA = new Date(a[sortConfig.key] || 0);
                    const dateB = new Date(b[sortConfig.key] || 0);
                    return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
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
        if (!assignment.submission || assignment.submission.marks === null) return "-";
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
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A560CF]"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-black p-4 md:p-6"
        >
            <h1 className="text-2xl md:text-3xl font-bold bg-[#FB773C] bg-clip-text text-transparent mb-6 text-center">
                Grades
            </h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 bg-[#FAF9F6] border border-[#EB3678]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A560CF] text-white placeholder-gray-400"
                />
            </div>

            {/* Grades Table */}
            <div className="overflow-x-auto rounded-xl shadow-lg border border-[#EB3678]/20">
                <table className="w-full">
                    <thead className="bg-[#FB773C]">
                        <tr>
                            {['Title', 'Description', 'Due Date', 'Submitted On', 'Status', 'Grade'].map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-[#EB3678]/80 transition-colors"
                                    onClick={() => requestSort(header.toLowerCase().replace(' ', ''))}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-[#EB3678]/10">
                        {sortedAssignments.length > 0 ? (
                            sortedAssignments.map((assignment) => (
                                <motion.tr
                                    key={assignment.assignmentId}
                                    whileHover={{ backgroundColor: '#2D374850' }}
                                    className="transition-colors duration-200"
                                >
                                    <td className="px-4 py-3 text-[#E5E5E5]">{assignment.title}</td>
                                    <td className="px-4 py-3 text-[#E5E5E5]">{assignment.description}</td>
                                    <td className="px-4 py-3 text-[#E5E5E5]">{formatDate(assignment.dueDate)}</td>
                                    <td className="px-4 py-3 text-[#E5E5E5]">
                                        {formatDate(assignment.submission?.submissionDate)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            getStatus(assignment) === "Graded"
                                                ? "bg-[#10B981]/20 text-[#10B981]"
                                                : getStatus(assignment) === "Submitted"
                                                ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                                                : "bg-gray-700 text-gray-400"
                                        }`}>
                                            {getStatus(assignment)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`font-semibold ${
                                            getGrade(assignment) === "A" ? "text-[#10B981]" :
                                            getGrade(assignment) === "B+" ? "text-[#3B82F6]" :
                                            getGrade(assignment) === "B" ? "text-[#A560CF]" :
                                            "text-gray-400"
                                        }`}>
                                            {getGrade(assignment)}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-[#E5E5E5]">
                                    No assignments found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Grade;