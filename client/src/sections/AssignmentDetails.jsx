// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router";
// import {
//     FaBook,
//     FaCalendarCheck,
//     FaDownload,
//     FaUser,
//     FaFilePdf,
//     FaChalkboardTeacher,
// } from "react-icons/fa";
// import axiosInstance from "../utils/axiosInstance";
// import SubmissionGrading from "../components/SubmissionGrading";

// const TeacherAssignmentDetails = () => {
//     const { assignmentId } = useParams(); // Get assignment ID from URL
//     const [assignment, setAssignment] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedSubmission, setSelectedSubmission] = useState(null);

//     // Fetch assignment details when component mounts
//     useEffect(() => {
//         const getSubmissions = async () => {
//             const response = await axiosInstance.get(
//                 `/assignment/submission/${assignmentId}`
//             );
//             return response.data;
//         };
//         const fetchAssignmentDetails = async () => {
//             try {
//                 const response = await axiosInstance.get(
//                     `/assignment/${assignmentId}`
//                 );
//                 const submissions = await getSubmissions();
//                 const data = response.data;
//                 const fetchedAssignment = {
//                     id: data.assignmentId.toString(),
//                     title: data.title || "Untitled",
//                     description: data.description || "No description provided",
//                     dueDate: data.dueDate || "Not specified",
//                     teacher: data.user?.fullName || "Unknown Teacher",
//                     submittedOn: data.submittedOn || "Not submitted",
//                     className: data.class?.className || `Class ${data.classId}`, // Assuming Class has a Name property
//                     submissions:
//                         submissions.map((s) => ({
//                             submissionId: s.submissionId,
//                             studentId: s.studentId,
//                             submissionDate: s.submissionDate,
//                             filePath: s.filePath,
//                             marks: s.marks,
//                             feedback: s.feedback,
//                         })) || [],
//                 };
//                 setAssignment(fetchedAssignment);
//             } catch (err) {
//                 setError(
//                     "Failed to load assignment: " +
//                         (err.response?.data?.message || err.message)
//                 );
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchAssignmentDetails();
//     }, [assignmentId]);

//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return "Not specified";
//         return new Date(dateString).toLocaleString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     const handleGradingComplete = (updatedSubmission) => {
//         try {
//             setAssignment((prev) => ({
//                 ...prev,
//                 submissions: prev.submissions.map((submission) =>
//                     submission.submissionId === updatedSubmission.submissionId
//                         ? {
//                               ...submission,
//                               marks: updatedSubmission.marks,
//                               feedback: updatedSubmission.feedback,
//                           }
//                         : submission
//                 ),
//             }));
//             // Close the grading modal
//             setSelectedSubmission(null);
//         } catch (error) {
//             console.error("Error updating submission:", error);
//             alert("Failed to update submission display");
//         }
//     };

//     // Handle file download
//     const handleDownload = async (submissionId) => {
//         try {
//             const response = await axiosInstance.get(
//                 `/submission/download/${submissionId}`,
//                 {
//                     responseType: "blob",
//                 }
//             );
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `submission_${submissionId}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error(
//                 "Download failed:",
//                 error.response?.data || error.message
//             );
//             alert("Failed to download submission.");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-4xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-12">
//                     <h1 className="text-4xl font-bold text-purple-700 mb-2">
//                         <FaBook className="inline-block mr-2" />
//                         Assignment Details
//                     </h1>
//                     <p className="text-lg text-gray-600">
//                         View assignment details and student submissions
//                     </p>
//                 </div>

//                 {/* Loading/Error State */}
//                 {isLoading ? (
//                     <p className="text-center text-gray-600">
//                         Loading assignment details...
//                     </p>
//                 ) : error ? (
//                     <p className="text-center text-red-600">{error}</p>
//                 ) : !assignment ? (
//                     <p className="text-center text-gray-600">
//                         Assignment not found.
//                     </p>
//                 ) : (
//                     <div className="bg-white rounded-xl shadow-lg p-8">
//                         {/* Assignment Details */}
//                         <div className="mb-8">
//                             <h2 className="text-3xl font-semibold text-gray-900 mb-4">
//                                 {assignment.title}
//                             </h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                                 <div className="flex items-center text-gray-600">
//                                     <FaUser className="h-5 w-5 mr-2" />
//                                     <span>Teacher: {assignment.teacher}</span>
//                                 </div>
//                                 <div className="flex items-center text-gray-600">
//                                     <FaChalkboardTeacher className="h-5 w-5 mr-2" />
//                                     <span>Class: {assignment.className}</span>
//                                 </div>
//                                 <div className="flex items-center text-gray-600">
//                                     <FaCalendarCheck className="h-5 w-5 mr-2" />
//                                     <span>
//                                         Due: {formatDate(assignment.dueDate)}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center text-gray-600">
//                                     <FaCalendarCheck className="h-5 w-5 mr-2" />
//                                     <span>
//                                         Submitted On:{" "}
//                                         {formatDate(assignment.submittedOn)}
//                                     </span>
//                                 </div>
//                             </div>
//                             <p className="text-gray-700 text-lg">
//                                 {assignment.description}
//                             </p>
//                         </div>

//                         {/* Submissions Section */}
//                         <div className="border-t pt-6">
//                             <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//                                 Submissions ({assignment.submissions.length})
//                             </h3>
//                             {assignment.submissions.length === 0 ? (
//                                 <p className="text-gray-600">
//                                     No submissions yet.
//                                 </p>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {assignment.submissions.map(
//                                         (submission) => (
//                                             <div
//                                                 key={submission.submissionId}
//                                                 className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
//                                             >
//                                                 <div>
//                                                     <p className="text-gray-800 font-medium">
//                                                         Student ID:{" "}
//                                                         {submission.studentId}
//                                                     </p>
//                                                     <p className="text-gray-600 text-sm">
//                                                         Submitted:{" "}
//                                                         {formatDate(
//                                                             submission.submissionDate
//                                                         )}
//                                                     </p>
//                                                     {submission.marks !==
//                                                         null && (
//                                                         <p className="text-gray-600 text-sm">
//                                                             Marks:{" "}
//                                                             {submission.marks}
//                                                         </p>
//                                                     )}
//                                                     {submission.feedback && (
//                                                         <p className="text-gray-600 text-sm">
//                                                             Feedback:{" "}
//                                                             {
//                                                                 submission.feedback
//                                                             }
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                                 <button
//                                                     onClick={() =>
//                                                         setSelectedSubmission(
//                                                             submission
//                                                         )
//                                                     }
//                                                     className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
//                                                 >
//                                                     {submission.marks !== null
//                                                         ? "Update Grade"
//                                                         : "Grade Submission"}
//                                                 </button>
//                                             </div>
//                                         )
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Grading Modal */}
//                         {selectedSubmission && (
//                             <SubmissionGrading
//                                 submission={selectedSubmission}
//                                 onClose={() => setSelectedSubmission(null)}
//                                 onGradingComplete={handleGradingComplete}
//                             />
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default TeacherAssignmentDetails;

import React, { useState, useEffect } from "react";
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
    const [showGradeModal, setShowGradeModal] = useState(false);

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
                            status:
                                s.marks !== undefined && s.marks !== null
                                    ? "Graded"
                                    : "Pending",
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
                `/Grade/assign/${submissionId}`,
                {
                    marks: numericMarks,
                    feedback,
                    totalMarks: numericTotalMarks,
                }
            );

            if (response.data) {
                toast.success("Grade submitted successfully");
                setShowGradeModal(false);
                // Refresh the assignment data
                const updatedResponse = await axiosInstance.get(
                    `/assignment/${assignmentId}`
                );
                const updatedSubmissions = await axiosInstance.get(
                    `/assignment/submission/${assignmentId}`
                );
                setAssignment({
                    ...updatedResponse.data,
                    submissions: updatedSubmissions.data.map((s) => ({
                        ...s,
                        graded: s.marks !== undefined && s.marks !== null,
                        status:
                            s.marks !== undefined && s.marks !== null
                                ? "Graded"
                                : "Pending",
                    })),
                });
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to submit grade";
            toast.error(errorMessage);
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
            console.error(
                "Download failed:",
                error.response?.data || error.message
            );
            toast.error("Failed to download submission.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <Link
                to="/assignments"
                className="flex items-center mb-4 text-blue-600 hover:underline"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Assignments
            </Link>

            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold mb-4">{assignment.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                        <User className="h-5 w-5 mr-2" />
                        <span>Teacher: {assignment.teacher}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2" />
                        <span>Class: {assignment.className}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                        {assignment.description}
                    </p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6">
                Student Submissions ({assignment.submissions.length})
            </h2>

            {assignment.submissions.length === 0 ? (
                <div className="text-center text-gray-500">
                    No submissions yet.
                </div>
            ) : (
                <div className="grid gap-6">
                    {assignment.submissions.map((submission) => (
                        <div
                            key={submission.submissionId}
                            className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {submission.studentName}
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    {submission.email}
                                </p>
                                <p className="text-sm text-gray-500 mb-1">
                                    Submitted:{" "}
                                    {formatDate(submission.submissionDate)}
                                </p>
                                <div className="flex items-center gap-1">
                                    <p
                                        className={`text-sm font-semibold ${
                                            submission.status === "Graded"
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                        }`}
                                    >
                                        Status: {submission.status}
                                    </p>
                                    {submission.graded && (
                                        <span className="text-sm text-blue-600 ml-2">
                                            ({submission.marks}/
                                            {gradingData.totalMarks})
                                        </span>
                                    )}
                                </div>
                                {submission.feedback && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Feedback: {submission.feedback}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 mt-4 sm:mt-0">
                                <button
                                    onClick={() =>
                                        handleDownload(submission.submissionId)
                                    }
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>

                                <button
                                    onClick={() => handleGradeClick(submission)}
                                    className="flex items-center gap-1 text-green-600 hover:underline"
                                >
                                    {submission.graded ? (
                                        <>
                                            <Edit className="w-4 h-4" />
                                            Update Grade
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Grade
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Grade Modal */}
            {showGradeModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <form
                        onSubmit={handleGradeSubmit}
                        className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Assign Grade
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowGradeModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marks
                            </label>
                            <input
                                type="number"
                                placeholder="Marks"
                                value={gradingData.marks}
                                onChange={(e) =>
                                    setGradingData({
                                        ...gradingData,
                                        marks: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border rounded"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Marks
                            </label>
                            <input
                                type="number"
                                placeholder="Total Marks"
                                value={gradingData.totalMarks}
                                onChange={(e) =>
                                    setGradingData({
                                        ...gradingData,
                                        totalMarks: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border rounded"
                                required
                                min="1"
                                step="1"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Feedback
                            </label>
                            <textarea
                                placeholder="Feedback"
                                value={gradingData.feedback}
                                onChange={(e) =>
                                    setGradingData({
                                        ...gradingData,
                                        feedback: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border rounded"
                                required
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGradeModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TeacherAssignmentDetails;
