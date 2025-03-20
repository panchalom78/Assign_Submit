import React from "react";
import { Book, GraduationCap, Calendar, Clock, User } from "lucide-react";

function TeacherAssignments() {
    // Mock data - replace with actual data from your backend
    const assignments = [
        {
            id: "1",
            title: "Introduction to React Hooks",
            course: "Computer Science",
            class: "Class A",
            description:
                "Create a simple application demonstrating the use of useState and useEffect hooks. Include examples of state management and side effects handling.",
            dueDate: "2024-03-25T23:59:00",
            teacher: "Dr. Sarah Johnson",
            createdAt: "2024-03-15T10:30:00",
        },
        {
            id: "2",
            title: "Advanced Calculus Problem Set",
            course: "Mathematics",
            class: "Class B",
            description:
                "Complete problems 1-10 from Chapter 5 on multivariable calculus. Show all work and include detailed explanations for each step.",
            dueDate: "2024-03-28T23:59:00",
            teacher: "Prof. Michael Chen",
            createdAt: "2024-03-16T14:20:00",
        },
        {
            id: "3",
            title: "Quantum Mechanics Research Paper",
            course: "Physics",
            class: "Class C",
            description:
                "Write a 2000-word research paper on the implications of quantum entanglement in quantum computing. Include at least 5 peer-reviewed sources.",
            dueDate: "2024-04-01T23:59:00",
            teacher: "Dr. Emily Brooks",
            createdAt: "2024-03-17T09:15:00",
        },
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Assignments Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        View all assignments created by teachers
                    </p>
                </div>

                <div className="space-y-6">
                    {assignments.map((assignment) => (
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
                                        getTimeRemaining(assignment.dueDate) ===
                                        "Past due"
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
                                        Due: {formatDate(assignment.dueDate)}
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
                                        console.log(
                                            "View details:",
                                            assignment.id
                                        )
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TeacherAssignments;
