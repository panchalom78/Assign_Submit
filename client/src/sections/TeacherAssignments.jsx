import React, { useEffect, useState } from "react";
import { Book, GraduationCap, Calendar, Clock, User } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router";
import TeacherNavbar from "../components/TeacherNavbar";
import TeacherMenu from "../components/TeacherMenu";
function TeacherAssignments() {
    const [assignments, setAssignments] = useState([]); // State to hold assignments
    const navigate = useNavigate();

    // Fetch assignments when component mounts
    useEffect(() => {
        const getAssignments = async () => {
            try {
                const response = await axiosInstance.get(
                    "/assignment/get/teacher"
                );
                const fetchedAssignments = response.data.assignments.map(
                    (src) => ({
                        id: src.assignmentId.toString(),
                        title: src.title,
                        course: `${src.class.course.courseName}`, // Hardcoded; replace with actual logic if available
                        class: `${src.class.className}`, // Inferred from classId
                        description: src.description,
                        dueDate: src.dueDate.replace(" ", "T"), // Convert to ISO 8601
                        teacher: src.user.fullName,
                        createdAt: src.submittedOn
                            ? src.submittedOn.replace(" ", "T")
                            : "2024-03-20T00:00:00", // Fallback to current date if null
                    })
                );
                setAssignments(fetchedAssignments); // Update state with mapped data
            } catch (error) {
                console.error("Error fetching assignments:", error);
                setAssignments([]); // Set empty array on error to avoid undefined issues
            }
        };

        getAssignments(); // Call the async function
    }, []); // Empty dependency array means it runs once on mount

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Calculate time remaining until due date
    const getTimeRemaining = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due.getTime() - now.getTime();

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        if (diff < 0) return "Past due";
        if (days > 0) return `${days} days remaining`;
        return `${hours} hours remaining`;
    };

    return (
        <>
            {/* <TeacherNavbar /> */}
            <div className="min-h-screen bg-gray-50">
                <TeacherNavbar />
                <div className="flex">
                    <TeacherMenu />
                    <div className="flex-1 p-8 justify-self-end md:ml-64">
                        <div className="max-w-6xl mx-auto">
                            {/* Header Section */}
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">
                                            Assignments Dashboard
                                        </h1>
                                        <p className="text-gray-600 mt-1">
                                            Manage and track your created
                                            assignments
                                        </p>
                                    </div>
                                    <Link
                                        to="/create-assignments"
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
                                    >
                                        <span className="hidden sm:inline">
                                            Create New
                                        </span>{" "}
                                        Assignment
                                    </Link>
                                </div>
                            </div>

                            {/* Assignments Grid */}
                            <div className="grid gap-6">
                                {assignments.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                        <p className="text-gray-600 text-lg">
                                            No assignments available.
                                        </p>
                                    </div>
                                ) : (
                                    assignments.map((assignment) => (
                                        <div
                                            key={assignment.id}
                                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h2 className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200">
                                                        {assignment.title}
                                                    </h2>
                                                    <span
                                                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                                                            getTimeRemaining(
                                                                assignment.dueDate
                                                            ) === "Past due"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {getTimeRemaining(
                                                            assignment.dueDate
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center text-gray-600 bg-gray-50 rounded-md p-2">
                                                        <Book className="h-5 w-5 mr-2 text-indigo-500" />
                                                        <span>
                                                            {assignment.course}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 bg-gray-50 rounded-md p-2">
                                                        <GraduationCap className="h-5 w-5 mr-2 text-indigo-500" />
                                                        <span>
                                                            {assignment.class}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 bg-gray-50 rounded-md p-2">
                                                        <User className="h-5 w-5 mr-2 text-indigo-500" />
                                                        <span>
                                                            {assignment.teacher}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 bg-gray-50 rounded-md p-2">
                                                        <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                                                        <span>
                                                            Due:{" "}
                                                            {formatDate(
                                                                assignment.dueDate
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {assignment.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center text-gray-500">
                                                        <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                                                        <span className="text-sm">
                                                            Created:{" "}
                                                            {formatDate(
                                                                assignment.createdAt
                                                            )}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/assignment-details/${assignment.id}`
                                                            )
                                                        }
                                                        className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                                                    >
                                                        View Details
                                                        <span className="text-xl">
                                                            →
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TeacherAssignments;
