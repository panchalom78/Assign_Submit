import React, { useState, useEffect,useNavigate } from "react";
import { useParams, Link } from "react-router";
import {
    ArrowLeft,
    Download,
    CheckCircle,
    X,
    Edit,
    FileText,
    Calendar,
    User,
    BookOpen,
    Users,
    AlertCircle,
    Clock,
    AlertTriangle,
    ThumbsUp,
    RefreshCw
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherAssignmentDetails = () => {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gradingData, setGradingData] = useState({
        submissionId: null,
        marks: "",
        feedback: "",
        totalMarks: "10",
    });
    const [remarkData, setRemarkData] = useState({
        submissionId: null,
        message: "",
        resubmissionRequired: false,
        resubmissionDeadline: "",
    });
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [showRemarkModal, setShowRemarkModal] = useState(false);

    // Status color mapping
    const statusColors = {
        "Graded": "bg-emerald-100 text-emerald-800",
        "Remark Added": "bg-blue-100 text-blue-800",
        "Needs Resubmission": "bg-amber-100 text-amber-800",
        "Pending": "bg-gray-100 text-gray-800"
    };

    // Status icons
    const statusIcons = {
        "Graded": <ThumbsUp className="w-4 h-4" />,
        "Remark Added": <AlertCircle className="w-4 h-4" />,
        "Needs Resubmission": <AlertTriangle className="w-4 h-4" />,
        "Pending": <Clock className="w-4 h-4" />
    };

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
                    className: data.class?.className || `Class ${data.classId}`,
                    submissions:
                        submissions.map((s) => ({
                            submissionId: s.submissionId,
                            studentId: s.studentId,
                            studentName: s.fullName || `Student ${s.studentId}`,
                            email: s.email || "No email provided",
                            submissionDate: s.submissionDate,
                            filePath: s.filePath,
                            marks: s.marks,
                            feedback: s.feedback,
                            graded: s.marks !== undefined && s.marks !== null,
                            status: getSubmissionStatus(s),
                            remarks: s.remarks || []
                        })) || [],
                };

                setAssignment(fetchedAssignment);
            } catch (err) {
                setError(
                    "Failed to load assignment: " +
                    (err.response?.data?.message || err.message)
                );
                toast.error("Failed to load assignment details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignmentDetails();
    }, [assignmentId]);

    const getSubmissionStatus = (submission) => {
        if (submission.marks !== undefined && submission.marks !== null) {
            return "Graded";
        }
        if (submission.resubmissionRequired === true) {
            return "Needs Resubmission";
        }
        if (submission.remarks && submission.remarks.length > 0) {
            return "Remark Added";
        }
        return "Pending";
    };

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

    const handleGradeClick = (submission) => {
        setGradingData({
            submissionId: submission.submissionId,
            marks: submission.marks != null ? submission.marks.toString() : "",
            feedback: submission.feedback || "",
            totalMarks: "10",
        });
        setShowGradeModal(true);
    };

    const handleRemarkClick = (submission) => {
        setRemarkData({
            submissionId: submission.submissionId,
            message: "",
            resubmissionRequired: false,
            resubmissionDeadline: "",
        });
        setShowRemarkModal(true);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            const { submissionId, marks, feedback, totalMarks } = gradingData;
            const numericMarks = parseFloat(marks);
            const numericTotalMarks = parseFloat(totalMarks);

            if (isNaN(numericMarks)) {
                throw new Error("Please enter valid marks");
            }

            if (isNaN(numericTotalMarks)) {
                throw new Error("Please enter valid total marks");
            }

            if (numericMarks < 0 || numericMarks > numericTotalMarks) {
                throw new Error(
                    `Marks must be between 0 and ${numericTotalMarks}`
                );
            }

            const response = await axiosInstance.post(
                `/submission/grade/${submissionId}`,
                {
                    marks: numericMarks,
                    feedback: feedback
                }
            );

            if (response.data) {
                toast.success("Grade submitted successfully");
                setShowGradeModal(false);
                // Refresh the assignment data
                const updatedSubmissions = await axiosInstance.get(
                    `/assignment/submission/${assignmentId}`
                );
                setAssignment(prev => ({
                    ...prev,
                    submissions: updatedSubmissions.data.map(s => ({
                        ...s,
                        graded: s.marks !== undefined && s.marks !== null,
                        status: getSubmissionStatus(s),
                    })),
                }));
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to submit grade";
            toast.error(errorMessage);
        }
    };

    const handleRemarkSubmit = async (e) => {
        
        e.preventDefault();
        try {
            const { submissionId, message, resubmissionRequired, resubmissionDeadline } = remarkData;
            console.log(remarkData);
            
            if (!message.trim()) {
                throw new Error("Remark message is required");
            }

            if (resubmissionRequired && !resubmissionDeadline) {
                throw new Error("Please set a deadline for resubmission");
            }

            const userIdResponse = await axiosInstance.get("/auth/get-user-id");
            const userId = userIdResponse.data.userId;

            const payload = {
                submissionId,
                message: message.trim(),
                resubmissionRequired,
                resubmissionDeadline: resubmissionRequired
                    ? new Date(resubmissionDeadline).toISOString()
                    : null
            };

            const response = await axiosInstance.post(`/remark/create?userId=${userId}`, payload);
            console.log(response);
            
            if (response.data) {
                toast.success("Remark submitted successfully");
                setShowRemarkModal(false);

                // Refresh data with proper status
                const updatedSubmissions = await axiosInstance.get(
                    `/assignment/submission/${assignmentId}`
                );
                console.log(updatedSubmissions);

                setAssignment(prev => ({
                    ...prev,
                    submissions: updatedSubmissions.data.map(s => ({
                        ...s,
                        status: getSubmissionStatus(s),
                        remarks: s.remarks || []
                    })),
                }));
            }
        } catch (error) {
            console.error("Error submitting remark:", error);
            toast.error(error.response?.data?.message || "Failed to submit remark");
        }
    };

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
            console.error("Download failed:", error.response?.data || error.message);
            toast.error("Failed to download submission.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading assignment details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
                    <div className="text-red-500 mb-4">
                        <AlertCircle className="w-10 h-10 mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Error Loading Assignment</h2>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <Link
                        to="/assignments"
                        className="flex items-center justify-center text-indigo-600 hover:underline"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Assignments
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link
                    to="/assignments"
                    className="inline-flex items-center mb-6 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="font-medium"
                    onClick={() => navigate('/login')}>Back to Assignments</span>
                </Link>

                {/* Assignment Header Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <User className="w-4 h-4 mr-1.5" />
                                    <span>Created by {assignment.teacher}</span>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {assignment.className}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-xs text-gray-500">Due Date</p>
                                        <p className="font-medium">{formatDate(assignment.dueDate)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-xs text-gray-500">Submissions</p>
                                        <p className="font-medium">{assignment.submissions.length} students</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <RefreshCw className="w-5 h-5 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-xs text-gray-500">Last Updated</p>
                                        <p className="font-medium">{formatDate(assignment.submittedOn)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                                <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                                Description
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-700">
                                {assignment.description.split('\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Student Submissions <span className="text-gray-500">({assignment.submissions.length})</span>
                        </h2>
                    </div>

                    {assignment.submissions.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="mx-auto h-24 w-24 text-gray-400">
                                <FileText className="w-full h-full" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No submissions yet</h3>
                            <p className="mt-1 text-gray-500">Students haven't submitted their work for this assignment.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {assignment.submissions.map((submission) => (
                                <div key={submission.submissionId} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                        {/* Student Info */}
                                        <div className="mb-4 md:mb-0">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-800 font-medium">
                                                        {submission.studentName?.charAt(0) || 'S'}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {submission.studentName || `Student ${submission.studentId}`}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {submission.email || 'No email provided'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submission Details */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Submitted</p>
                                                <p className="font-medium">{formatDate(submission.submissionDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                                                        {statusIcons[submission.status]}
                                                        <span className="ml-1.5">{submission.status}</span>
                                                    </span>
                                                    {submission.graded && (
                                                        <span className="ml-2 text-sm font-medium text-gray-900">
                                                            ({submission.marks}/{gradingData.totalMarks})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 md:mt-0 flex space-x-3">
                                            <button
                                                onClick={() => handleDownload(submission.submissionId)}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </button>
                                            <button
                                                onClick={() => handleGradeClick(submission)}
                                                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${submission.graded ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                            >
                                                {submission.graded ? (
                                                    <>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Regrade
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Grade
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleRemarkClick(submission)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                Remark
                                            </button>
                                        </div>
                                    </div>

                                    {submission.feedback && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback</h4>
                                            <p className="text-gray-700">{submission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Grade Modal */}
            {showGradeModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleGradeSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <CheckCircle className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {gradingData.marks ? 'Update Grade' : 'Assign Grade'}
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label htmlFor="marks" className="block text-sm font-medium text-gray-700">Marks</label>
                                                    <input
                                                        type="number"
                                                        id="marks"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        value={gradingData.marks}
                                                        onChange={(e) => setGradingData({ ...gradingData, marks: e.target.value })}
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700">Total Marks</label>
                                                    <input
                                                        type="number"
                                                        id="totalMarks"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        value={gradingData.totalMarks}
                                                        onChange={(e) => setGradingData({ ...gradingData, totalMarks: e.target.value })}
                                                        min="1"
                                                        step="1"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Feedback</label>
                                                    <textarea
                                                        id="feedback"
                                                        rows={3}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        value={gradingData.feedback}
                                                        onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Submit Grade
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowGradeModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Remark Modal */}
            {showRemarkModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleRemarkSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <AlertCircle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Add Remark
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label htmlFor="remarkMessage" className="block text-sm font-medium text-gray-700">Message</label>
                                                    <textarea
                                                        id="remarkMessage"
                                                        rows={3}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        value={remarkData.message}
                                                        onChange={(e) => setRemarkData({ ...remarkData, message: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            id="resubmissionRequired"
                                                            name="resubmissionRequired"
                                                            type="checkbox"
                                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                            checked={remarkData.resubmissionRequired}
                                                            onChange={(e) => setRemarkData({ ...remarkData, resubmissionRequired: e.target.checked })}
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label htmlFor="resubmissionRequired" className="font-medium text-gray-700">Require Resubmission</label>
                                                    </div>
                                                </div>
                                                {remarkData.resubmissionRequired && (
                                                    <div>
                                                        <label htmlFor="resubmissionDeadline" className="block text-sm font-medium text-gray-700">Resubmission Deadline</label>
                                                        <input
                                                            type="datetime-local"
                                                            id="resubmissionDeadline"
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            value={remarkData.resubmissionDeadline}
                                                            onChange={(e) => setRemarkData({ ...remarkData, resubmissionDeadline: e.target.value })}
                                                            required={remarkData.resubmissionRequired}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Submit Remark
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRemarkModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherAssignmentDetails;