import React, { useState, useEffect } from "react";
import {
    FaUpload,
    FaComment,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

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
            console.log("Remarks response:", response.data);
            setRemarks(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching remarks:", err);
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

            toast.success("Assignment resubmitted successfully");
            fetchRemarks();
            setSelectedRemark(null);
            setFile(null);
        } catch (err) {
            console.error("Error resubmitting:", err);
            if (err.response?.status === 401) {
                window.location.href = "/login";
            } else {
                toast.error(
                    err.response?.data?.message ||
                        "Failed to resubmit. Please try again."
                );
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#160209] p-6 flex items-center justify-center">
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBC740] to-[#EB3678] text-xl">
                    Loading remarks...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#160209] p-6 flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#160209] p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FBC740] to-[#EB3678] mb-8">
                    Your Remarks
                </h1>

                {remarks.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 text-lg">
                        No remarks found. Your submissions haven't received any
                        feedback yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {remarks.map((remark) => (
                            <div
                                key={remark.id}
                                className="bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-700"
                                onClick={() => setSelectedRemark(remark)}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                remark.resubmissionRequired
                                                    ? "bg-[#FB773C] text-white"
                                                    : "bg-green-500 text-white"
                                            }`}
                                        >
                                            {remark.resubmissionRequired
                                                ? "Resubmit Required"
                                                : "Feedback"}
                                        </span>
                                        <FaComment className="text-[#FB773C]" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 text-white">
                                        {remark.assignmentTitle}
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        {remark.message}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-400">
                                        <span className="mr-2">From:</span>
                                        <span className="font-semibold text-white">
                                            {remark.userName}
                                        </span>
                                    </div>

                                    {remark.resubmissionDeadline && (
                                        <div className="text-xs text-[#FB773C] mt-2">
                                            Resubmission Deadline:{" "}
                                            {new Date(
                                                remark.resubmissionDeadline
                                            ).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Remark Details Modal */}
                {selectedRemark && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedRemark.assignmentTitle}
                                </h2>
                                <button
                                    onClick={() => setSelectedRemark(null)}
                                    className="text-white hover:text-[#FB773C] transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-300 mb-4">
                                    {selectedRemark.message}
                                </p>
                                <div className="flex items-center text-sm text-gray-400 mb-4">
                                    <span className="mr-2">From:</span>
                                    <span className="font-semibold text-white">
                                        {selectedRemark.userName}
                                    </span>
                                </div>
                                {selectedRemark.resubmissionRequired && (
                                    <div className="mt-3 text-sm text-[#FB773C] bg-gray-800 p-3 rounded-lg">
                                        <strong>Resubmission Required</strong>
                                        {selectedRemark.resubmissionDeadline && (
                                            <p className="mt-1">
                                                Deadline:{" "}
                                                {new Date(
                                                    selectedRemark.resubmissionDeadline
                                                ).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Resubmit Section */}
                            {selectedRemark.resubmissionRequired && (
                                <div>
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 ${
                                            file
                                                ? "border-[#FB773C] bg-gray-800/50"
                                                : "border-gray-700 hover:border-[#FB773C]"
                                        } transition-colors`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const droppedFile =
                                                e.dataTransfer.files[0];
                                            if (droppedFile)
                                                setFile(droppedFile);
                                        }}
                                    >
                                        <FaUpload className="text-3xl text-[#FB773C] mx-auto mb-4" />
                                        {file ? (
                                            <p className="text-[#FB773C]">
                                                {file.name}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-gray-300">
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
                                                    className="inline-block mt-4 px-4 py-2 bg-[#FB773C] text-white rounded-lg hover:opacity-90 cursor-pointer transition-opacity"
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
                                        className={`w-full py-3 text-white rounded-lg font-semibold transition-all ${
                                            file
                                                ? "bg-[#FB773C] hover:opacity-90"
                                                : "bg-gray-700 cursor-not-allowed"
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
