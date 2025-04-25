import React, { useState, useEffect } from "react";
import {
    FaUpload,
    FaComment,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

const Remark = () => {
    const [selectedRemark, setSelectedRemark] = useState(null);
    const [file, setFile] = useState(null);
    const [remarks, setRemarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRemarks();
    }, []);

    const fetchRemarks = async () => {
        try {
            const response = await axiosInstance.get("/remark");
            console.log("Remarks response:", response.data); // Debug log
            setRemarks(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching remarks:", err); // Debug log
            setError("Failed to fetch remarks. Please try again later.");
            setLoading(false);
            if (err.response?.status === 401) {
                window.location.href = "/login";
            }
        }
    };

    const handleResubmit = async (remarkId) => {
        try {
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("remarkId", remarkId);

            await axiosInstance.post("/submission/resubmit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Refresh remarks after resubmission
            fetchRemarks();
            setSelectedRemark(null);
            setFile(null);
        } catch (err) {
            console.error("Error resubmitting:", err);
            if (err.response?.status === 401) {
                window.location.href = "/login";
            } else {
                alert("Failed to resubmit. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
                <div className="text-purple-600 text-xl">
                    Loading remarks...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                    Remarks
                </h1>

                {remarks.length === 0 ? (
                    <div className="text-center text-gray-600 mt-10">
                        No remarks found. Your submissions haven't received any
                        feedback yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {remarks.map((remark) => (
                            <div
                                key={remark.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                onClick={() => setSelectedRemark(remark)}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                remark.status === "Resubmit"
                                                    ? "bg-red-100 text-red-600"
                                                    : remark.status ===
                                                      "Approved"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                            }`}
                                        >
                                            {remark.status}
                                        </span>
                                        <FaComment className="text-gray-400" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                        {remark.assignmentTitle}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {remark.subject}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="mr-2">Teacher:</span>
                                        <span className="font-semibold">
                                            {remark.teacherName}
                                        </span>
                                    </div>

                                    {remark.submissionDate && (
                                        <div className="text-xs text-gray-400 mt-2">
                                            Submitted:{" "}
                                            {new Date(
                                                remark.submissionDate
                                            ).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Remark Details Modal */}
                {selectedRemark && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedRemark.assignmentTitle}
                                </h2>
                                <button
                                    onClick={() => setSelectedRemark(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    {selectedRemark.message}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <span className="mr-2">Teacher:</span>
                                    <span className="font-semibold">
                                        {selectedRemark.teacherName}
                                    </span>
                                </div>
                                {selectedRemark.feedback && (
                                    <div className="text-sm text-gray-600">
                                        <strong>Feedback:</strong>{" "}
                                        {selectedRemark.feedback}
                                    </div>
                                )}
                                {selectedRemark.resubmissionDeadline && (
                                    <div className="mt-3 text-sm text-red-500">
                                        <strong>Resubmission Deadline:</strong>{" "}
                                        {new Date(
                                            selectedRemark.resubmissionDeadline
                                        ).toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Resubmit Section */}
                            {selectedRemark.status === "Resubmit" && (
                                <div>
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 ${
                                            file
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-300 hover:border-purple-300"
                                        }`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const droppedFile =
                                                e.dataTransfer.files[0];
                                            if (droppedFile)
                                                setFile(droppedFile);
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
                                                    or click to select files
                                                    (PDF, DOCX)
                                                </p>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id="file-upload"
                                                    onChange={(e) =>
                                                        setFile(
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    accept=".pdf,.docx,.doc"
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
                                            handleResubmit(selectedRemark.id)
                                        }
                                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                            file
                                                ? "bg-purple-500 hover:bg-purple-600 text-white"
                                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        }`}
                                        disabled={!file}
                                    >
                                        {file
                                            ? "Resubmit Assignment"
                                            : "Select File to Resubmit"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Remark;
