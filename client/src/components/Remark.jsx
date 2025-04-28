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
        <div className=" min-h-screen  p-6 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={`circle-${i}`}
                        className='absolute rounded-full opacity-10 animate-float'
                        style={{
                            background: `radial-gradient(circle, ${i % 2 === 0 ? '#EB3678' : '#FB773C'}, transparent)`,
                            width: `${Math.random() * 400 + 200}px`,
                            height: `${Math.random() * 400 + 200}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 30 + 30}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}

                {[...Array(20)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className='absolute rounded-full bg-white/5 animate-float'
                        style={{
                            width: `${Math.random() * 10 + 2}px`,
                            height: `${Math.random() * 10 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 20 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10 ">
                

                {remarks.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 text-lg">
                        No remarks found. Your submissions haven't received any feedback yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {remarks.map((remark) => (
                            <div
                                key={remark.id}
                                className="bg-[#FAF9F6] text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-800 hover:border-[#EB3678]/50"
                                onClick={() => setSelectedRemark(remark)}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                remark.status === "Resubmit"
                                                    ? "bg-[#FB773C] text-black border border-red-500/30"
                                                    : remark.status === "Approved"
                                                    ? "bg-green-900/30 text-green-400 border border-green-500/30"
                                                    : "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
                                            }`}
                                        >
                                            {remark.status}
                                        </span>
                                        <FaComment className="text-white" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 text-black">
                                        {remark.assignmentTitle}
                                    </h3>
                                    <p className="text-gray-400 mb-4">
                                        {remark.subject}
                                    </p>

                                    <div className="flex items-center text-sm text-black">
                                        <span className="mr-2">Teacher:</span>
                                        <span className="font-semibold text-black">
                                            {remark.teacherName}
                                        </span>
                                    </div>

                                    {remark.submissionDate && (
                                        <div className="text-xs text-black mt-2">
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
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-800">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-black">
                                    {selectedRemark.assignmentTitle}
                                </h2>
                                <button
                                    onClick={() => setSelectedRemark(null)}
                                    className="text-black hover:text-[#EB3678] transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-black mb-4">
                                    {selectedRemark.message}
                                </p>
                                <div className="flex items-center text-sm text-black mb-4">
                                    <span className="mr-2">Teacher:</span>
                                    <span className="font-semibold text-black">
                                        {selectedRemark.teacherName}
                                    </span>
                                </div>
                                {selectedRemark.feedback && (
                                    <div className="text-sm text-black bg-gray-800/50 p-3 rounded-lg">
                                        <strong className="text-[#FBC740]">Feedback:</strong>{" "}
                                        {selectedRemark.feedback}
                                    </div>
                                )}
                                {selectedRemark.resubmissionDeadline && (
                                    <div className="mt-3 text-sm text-[#FB773C] bg-gray-800 p-3 rounded-lg">
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
                                                ? "border-[#FB773C] bg-[#160209]/50"
                                                : "border-gray-700 hover:border-[#EB3678]/50"
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
                                                <p className="text-black">
                                                    Drag & drop files here
                                                </p>
                                                <p className="text-black text-sm mt-2">
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
                                                    className="inline-block mt-4 px-4 py-2 bg-[#FB773C] text-black rounded-lg hover:opacity-90 cursor-pointer transition-opacity"
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
                                        className={`w-full py-3 text-white bg-[#FB773C] rounded-lg font-semibold transition-all ${
                                            file
                                                ? "bg-[#FB773C] hover:opacity-90 text-black"
                                                : "bg-gray-800 text-black cursor-not-allowed"
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