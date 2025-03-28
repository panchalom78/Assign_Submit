import React, { useState } from "react";
import { FaDownload, FaUser, FaCalendarCheck, FaSave } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

const SubmissionGrading = ({ submission, onClose, onGradingComplete }) => {
    const [marks, setMarks] = useState(submission.marks || "");
    const [feedback, setFeedback] = useState(submission.feedback || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get(
                `/submission/download/${submission.submissionId}`,
                { responseType: "blob" }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `submission_${submission.submissionId}.pdf`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download submission.");
        }
    };

    const handleSubmitGrading = async () => {
        try {
            setIsSubmitting(true);
            const response = await axiosInstance.post(
                `/submission/grade/${submission.submissionId}`,
                {
                    marks: parseInt(marks),
                    feedback,
                }
            );
            onGradingComplete(response.data);
            onClose();
        } catch (error) {
            console.error("Grading failed:", error);
            alert("Failed to submit grading.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Grade Submission
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Submission Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-600">
                                <FaUser className="mr-2" />
                                <span>Student ID: {submission.studentId}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaCalendarCheck className="mr-2" />
                                <span>
                                    Submitted:{" "}
                                    {formatDate(submission.submissionDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <FaDownload className="mr-2" />
                        Download Submission
                    </button>

                    {/* Grading Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marks
                            </label>
                            <input
                                type="number"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                                min="0"
                                max="100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Feedback
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Provide feedback for the student..."
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmitGrading}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:bg-purple-300"
                    >
                        <FaSave className="mr-2" />
                        {isSubmitting ? "Submitting..." : "Submit Grading"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionGrading;
