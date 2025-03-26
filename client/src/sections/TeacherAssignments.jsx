import React, { useEffect, useState } from "react";
import { Book, GraduationCap, Calendar, Clock, User } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router";

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
                        course: "Unknown Course", // Hardcoded; replace with actual logic if available
                        class: `Class ${src.classId}`, // Inferred from classId
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="w-full flex items-center">
                    <div className="text-center mb-8 flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Assignments Dashboard
                        </h1>
                        <p className="text-lg text-gray-600">
                            View all assignments created by teachers
                        </p>
                    </div>
                    <div className="flex justify-center items-center p-5 h-full justify-self-end">
                        <button className="btn p-4 bg-blue-500 rounded-lg cursor-pointer">
                            <Link to="/create-assignments">
                                Create Assignment
                            </Link>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {assignments.length === 0 ? (
                        <p className="text-gray-600 text-center">
                            No assignments available.
                        </p>
                    ) : (
                        assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-semibold text-gray-900">
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
                                        {getTimeRemaining(assignment.dueDate)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <Book className="h-5 w-5 mr-2" />
                                        <span className="font-medium">
                                            {assignment.course}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <GraduationCap className="h-5 w-5 mr-2" />
                                        <span>{assignment.class}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <User className="h-5 w-5 mr-2" />
                                        <span>{assignment.teacher}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        <span>
                                            Due:{" "}
                                            {formatDate(assignment.dueDate)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4">
                                    {assignment.description}
                                </p>

                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center text-gray-500">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span className="text-sm">
                                            Created:{" "}
                                            {formatDate(assignment.createdAt)}
                                        </span>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() =>
                                            navigate(
                                                `/assignment-details/${assignment.id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default TeacherAssignments;
