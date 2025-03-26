import React, { useState, useEffect } from "react";
import {
    FaUpload,
    FaClock,
    FaBook,
    FaCalendarCheck,
    FaCheckCircle,
    FaFilePdf,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

const AssignmentSubmission = () => {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [file, setFile] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [pendingAssignments, setPendingAssignments] = useState([]);
    const [submittedAssignments, setSubmittedAssignments] = useState([]);

    // Fetch assignments when component mounts
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axiosInstance.get(
                    "/student/assignments"
                );
                const assignments = response.data.assignments;

                // Separate pending and submitted assignments
                const pending = assignments.filter((a) => !a.isSubmitted);
                const submitted = assignments.filter((a) => a.isSubmitted);

                setPendingAssignments(pending);
                setSubmittedAssignments(submitted);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchAssignments();
    }, []);

    const handleSubmit = async (assignmentId) => {
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append("assignmentId", assignmentId);
        formData.append("file", file);

        try {
            const response = await axiosInstance.post(
                "/submission/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log("Submission successful:", response.data);

            // Refresh assignments after successful submission
            const assignmentsResponse = await axiosInstance.get(
                "/student/assignments"
            );
            const assignments = assignmentsResponse.data.assignments;
            setPendingAssignments(assignments.filter((a) => !a.isSubmitted));
            setSubmittedAssignments(assignments.filter((a) => a.isSubmitted));

            setSelectedAssignment(null);
            setFile(null);
        } catch (error) {
            console.error(
                "Submission failed:",
                error.response?.data || error.message
            );
        }
    };

    const handleViewFeedback = (feedback) => {
        setFeedback(feedback);
        setShowFeedback(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-purple-600 mb-2">
                        <FaBook className="inline-block mr-2" />
                        Assignment Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage and submit your assignments with ease
                    </p>
                </div>

                {/* Pending Assignments */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                        Pending Assignments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingAssignments.map((assignment) => (
                            <div
                                key={assignment.assignmentId}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                onClick={() =>
                                    setSelectedAssignment(assignment)
                                }
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-600">
                                            Pending
                                        </span>
                                        <FaClock className="text-gray-400" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                        {assignment.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {assignment.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-purple-600">
                                            <FaCalendarCheck className="mr-2" />
                                            <span className="text-sm">
                                                Due:{" "}
                                                {formatDate(assignment.dueDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submission History */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                        Submission History
                    </h2>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        {submittedAssignments.map((submission) => (
                            <div
                                key={submission.assignmentId}
                                className="border-b border-gray-200 py-4 last:border-b-0"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {submission.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {submission.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                                            {submission.submission?.marks
                                                ? "Graded"
                                                : "Submitted"}
                                        </span>
                                        {submission.submission?.feedback && (
                                            <button
                                                onClick={() =>
                                                    handleViewFeedback(
                                                        submission.submission
                                                            .feedback
                                                    )
                                                }
                                                className="text-purple-600 hover:text-purple-800"
                                            >
                                                View Feedback
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Submitted on:{" "}
                                    {formatDate(
                                        submission.submission?.submissionDate
                                    )}
                                    {submission.submission?.marks && (
                                        <span className="ml-4 font-semibold text-purple-600">
                                            Marks: {submission.submission.marks}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assignment Submission Modal */}
                {selectedAssignment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedAssignment.title}
                                </h2>
                                <button
                                    onClick={() => setSelectedAssignment(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    {selectedAssignment.description}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <FaCalendarCheck className="mr-2" />
                                    Deadline:{" "}
                                    {formatDate(selectedAssignment.dueDate)}
                                </div>
                            </div>

                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 
                                ${
                                    file
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-300 hover:border-purple-300"
                                }`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const droppedFile = e.dataTransfer.files[0];
                                    if (droppedFile) setFile(droppedFile);
                                }}
                            >
                                <FaUpload className="text-3xl text-purple-500 mx-auto mb-4" />
                                {file ? (
                                    <p className="text-purple-600">
                                        {file.name}
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-gray-600">
                                            Drag & drop files here
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            or click to select files (PDF, DOCX)
                                        </p>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="file-upload"
                                            onChange={(e) =>
                                                setFile(e.target.files[0])
                                            }
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="inline-block mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
                                        >
                                            Choose File
                                        </label>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    handleSubmit(
                                        selectedAssignment.assignmentId
                                    )
                                }
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors"
                                disabled={!file}
                            >
                                {file
                                    ? "Submit Assignment"
                                    : "Select File to Submit"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Feedback Modal */}
                {showFeedback && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Feedback
                                </h2>
                                <button
                                    onClick={() => setShowFeedback(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-gray-600">{feedback}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentSubmission;
