import React, { useState, useEffect } from "react";
import {
    FaUpload,
    FaClock,
    FaBook,
    FaCalendarCheck,
    FaCheckCircle,
    FaFilePdf,
    FaTimes,
    FaSpinner,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";

const AssignmentSubmission = () => {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [file, setFile] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [pendingAssignments, setPendingAssignments] = useState([]);
    const [submittedAssignments, setSubmittedAssignments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axiosInstance.get(
                    "/student/assignments"
                );
                const assignments = response.data.assignments;

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

        setIsUploading(true);
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
        } finally {
            setIsUploading(false);
        }
    };

    const handleViewFeedback = (feedback) => {
        setFeedback(feedback);
        setShowFeedback(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen  p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}

                {/* Pending Assignments */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold sm:text-2xl  text-[#FB773C] mb-4">
                        Pending Assignments
                    </h2>
                    {pendingAssignments.length === 0 ? (
                        <div className="bg-[#1F1F1F] rounded-xl p-6 text-center border border-gray-700">
                            <p className="text-gray-400">
                                No pending assignments
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {pendingAssignments.map((assignment) => (
                                <motion.div
                                    key={assignment.assignmentId}
                                    whileHover={{ y: -5 }}
                                    className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#EB3678]/20"
                                    onClick={() =>
                                        setSelectedAssignment(assignment)
                                    }
                                >
                                    <div className="p-4 sm:p-6">
                                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                                            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-[#EB3678]/20 text-[#FB773C]">
                                                Pending
                                            </span>
                                            <FaClock className="text-[#FBC740]" />
                                        </div>

                                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white line-clamp-2">
                                            {assignment.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
                                            {assignment.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-[#FBC740] text-xs sm:text-sm">
                                                <FaCalendarCheck className="mr-2" />
                                                <span>
                                                    Due:{" "}
                                                    {formatDate(
                                                        assignment.dueDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submission History */}
                <div className="mb-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#FB773C] mb-4">
                        Submission{" "}
                        <span className="text-[#FB773C]">History</span>
                    </h2>
                    <div className="bg-[#1F1F1F] p-12 rounded-xl shadow-lg  sm:p-6 border border-gray-700  ">
                        {submittedAssignments.length > 0 ? (
                            submittedAssignments.map((submission) => (
                                <motion.div
                                    key={submission.assignmentId}
                                    whileHover={{
                                        backgroundColor: "#2D374850",
                                    }}
                                    className="border-b bg-[#FAF9F6] p-12 rounded-xl border-gray-700 py-3 sm:py-4 last:border-b-0 transition-colors duration-200"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                                        <div className="flex-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-black line-clamp-1">
                                                {submission.title}
                                            </h3>
                                            <p className="text-black text-sm line-clamp-1">
                                                {submission.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2 sm:space-x-4">
                                            <span
                                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                                                    submission.submission?.marks
                                                        ? "bg-green-400 text-black"
                                                        : "bg-orange-400 text-black"
                                                }`}
                                            >
                                                {submission.submission?.marks
                                                    ? "Graded"
                                                    : "Submitted"}
                                            </span>
                                            {submission.submission
                                                ?.feedback && (
                                                <button
                                                    onClick={() =>
                                                        handleViewFeedback(
                                                            submission
                                                                .submission
                                                                .feedback
                                                        )
                                                    }
                                                    className="text-black hover:text-gray-400 text-xs sm:text-sm transition-colors whitespace-nowrap"
                                                >
                                                    View Feedback
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs sm:text-sm text-gray-500">
                                        <span>
                                            Submitted:{" "}
                                            {formatDate(
                                                submission.submission
                                                    ?.submissionDate
                                            )}
                                        </span>
                                        {submission.submission?.marks && (
                                            <span className="ml-2 sm:ml-4 font-semibold text-[#FBC740]">
                                                | Marks:{" "}
                                                {submission.submission.marks}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                No submission history available
                            </div>
                        )}
                    </div>
                </div>

                {/* Assignment Submission Modal */}
                {selectedAssignment && (
                    <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-[#EB3678]/30"
                        >
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-1">
                                    {selectedAssignment.title}
                                </h2>
                                <button
                                    onClick={() => setSelectedAssignment(null)}
                                    className="text-gray-400 hover:text-white p-1"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                                    {selectedAssignment.description}
                                </p>
                                <div className="flex items-center text-sm text-[#FBC740] mb-3 sm:mb-4">
                                    <FaCalendarCheck className="mr-2" />
                                    <span>
                                        Deadline:{" "}
                                        {formatDate(selectedAssignment.dueDate)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 sm:mb-6 transition-colors ${
                                    file
                                        ? "border-[#FBC740] bg-[#FBC740]/10"
                                        : "border-gray-700 hover:border-[#FBC740]"
                                }`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const droppedFile = e.dataTransfer.files[0];
                                    if (droppedFile) setFile(droppedFile);
                                }}
                            >
                                <FaUpload className="text-3xl text-[#FBC740] mx-auto mb-3 sm:mb-4" />
                                {file ? (
                                    <div>
                                        <p className="text-[#FBC740] text-sm sm:text-base">
                                            {file.name}
                                        </p>
                                        <button
                                            onClick={() => setFile(null)}
                                            className="text-xs text-[#EB3678] hover:underline mt-2"
                                        >
                                            Change File
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-400 text-sm sm:text-base">
                                            Drag & drop files here
                                        </p>
                                        <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
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
                                            className="inline-block mt-3 sm:mt-4 px-4 py-2 bg-gradient-to-r from-[#EB3678] to-[#FB773C] text-white rounded-lg hover:shadow-lg cursor-pointer transition-all text-sm sm:text-base"
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
                                className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                                    file && !isUploading
                                        ? "bg-gradient-to-r from-[#EB3678] to-[#FB773C] hover:shadow-lg"
                                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={!file || isUploading}
                            >
                                {isUploading ? (
                                    <div className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Uploading...
                                    </div>
                                ) : file ? (
                                    "Submit Assignment"
                                ) : (
                                    "Select File to Submit"
                                )}
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* Feedback Modal */}
                {showFeedback && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-[#FBC740]/30"
                        >
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-[#FBC740]">
                                    Feedback
                                </h2>
                                <button
                                    onClick={() => setShowFeedback(false)}
                                    className="text-gray-400 hover:text-white p-1"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>
                            <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
                                <p className="text-gray-300 text-sm sm:text-base whitespace-pre-wrap">
                                    {feedback || "No feedback provided"}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentSubmission;
