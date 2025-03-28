import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
    FaBook,
    FaCalendarCheck,
    FaDownload,
    FaUser,
    FaFilePdf,
    FaChalkboardTeacher,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import SubmissionGrading from "../components/SubmissionGrading";

const TeacherAssignmentDetails = () => {
    const { assignmentId } = useParams(); // Get assignment ID from URL
    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Fetch assignment details when component mounts
    useEffect(() => {
        const getSubmissions = async () => {
            const response = await axiosInstance.get(
                `/assignment/submission/${assignmentId}`
            );
            return response.data;
        };
        const fetchAssignmentDetails = async () => {
            try {
                const response = await axiosInstance.get(
                    `/assignment/${assignmentId}`
                );
                const submissions = await getSubmissions();
                const data = response.data;
                const fetchedAssignment = {
                    id: data.assignmentId.toString(),
                    title: data.title || "Untitled",
                    description: data.description || "No description provided",
                    dueDate: data.dueDate || "Not specified",
                    teacher: data.user?.fullName || "Unknown Teacher",
                    submittedOn: data.submittedOn || "Not submitted",
                    className: data.class?.className || `Class ${data.classId}`, // Assuming Class has a Name property
                    submissions:
                        submissions.map((s) => ({
                            submissionId: s.submissionId,
                            studentId: s.studentId,
                            submissionDate: s.submissionDate,
                            filePath: s.filePath,
                            marks: s.marks,
                            feedback: s.feedback,
                        })) || [],
                };
                setAssignment(fetchedAssignment);
            } catch (err) {
                setError(
                    "Failed to load assignment: " +
                        (err.response?.data?.message || err.message)
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignmentDetails();
    }, [assignmentId]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleGradingComplete = (updatedSubmission) => {
        try {
            setAssignment((prev) => ({
                ...prev,
                submissions: prev.submissions.map((submission) =>
                    submission.submissionId === updatedSubmission.submissionId
                        ? {
                              ...submission,
                              marks: updatedSubmission.marks,
                              feedback: updatedSubmission.feedback,
                          }
                        : submission
                ),
            }));
            // Close the grading modal
            setSelectedSubmission(null);
        } catch (error) {
            console.error("Error updating submission:", error);
            alert("Failed to update submission display");
        }
    };

    // Handle file download
    const handleDownload = async (submissionId) => {
        try {
            const response = await axiosInstance.get(
                `/submission/download/${submissionId}`,
                {
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `submission_${submissionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Download failed:",
                error.response?.data || error.message
            );
            alert("Failed to download submission.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-purple-700 mb-2">
                        <FaBook className="inline-block mr-2" />
                        Assignment Details
                    </h1>
                    <p className="text-lg text-gray-600">
                        View assignment details and student submissions
                    </p>
                </div>

                {/* Loading/Error State */}
                {isLoading ? (
                    <p className="text-center text-gray-600">
                        Loading assignment details...
                    </p>
                ) : error ? (
                    <p className="text-center text-red-600">{error}</p>
                ) : !assignment ? (
                    <p className="text-center text-gray-600">
                        Assignment not found.
                    </p>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {/* Assignment Details */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                                {assignment.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center text-gray-600">
                                    <FaUser className="h-5 w-5 mr-2" />
                                    <span>Teacher: {assignment.teacher}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaChalkboardTeacher className="h-5 w-5 mr-2" />
                                    <span>Class: {assignment.className}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaCalendarCheck className="h-5 w-5 mr-2" />
                                    <span>
                                        Due: {formatDate(assignment.dueDate)}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaCalendarCheck className="h-5 w-5 mr-2" />
                                    <span>
                                        Submitted On:{" "}
                                        {formatDate(assignment.submittedOn)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 text-lg">
                                {assignment.description}
                            </p>
                        </div>

                        {/* Submissions Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                Submissions ({assignment.submissions.length})
                            </h3>
                            {assignment.submissions.length === 0 ? (
                                <p className="text-gray-600">
                                    No submissions yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {assignment.submissions.map(
                                        (submission) => (
                                            <div
                                                key={submission.submissionId}
                                                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                                            >
                                                <div>
                                                    <p className="text-gray-800 font-medium">
                                                        Student ID:{" "}
                                                        {submission.studentId}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        Submitted:{" "}
                                                        {formatDate(
                                                            submission.submissionDate
                                                        )}
                                                    </p>
                                                    {submission.marks !==
                                                        null && (
                                                        <p className="text-gray-600 text-sm">
                                                            Marks:{" "}
                                                            {submission.marks}
                                                        </p>
                                                    )}
                                                    {submission.feedback && (
                                                        <p className="text-gray-600 text-sm">
                                                            Feedback:{" "}
                                                            {
                                                                submission.feedback
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setSelectedSubmission(
                                                            submission
                                                        )
                                                    }
                                                    className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                                                >
                                                    {submission.marks !== null
                                                        ? "Update Grade"
                                                        : "Grade Submission"}
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Grading Modal */}
                        {selectedSubmission && (
                            <SubmissionGrading
                                submission={selectedSubmission}
                                onClose={() => setSelectedSubmission(null)}
                                onGradingComplete={handleGradingComplete}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherAssignmentDetails;
