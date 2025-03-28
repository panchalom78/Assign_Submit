import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
const AffiliationForm = () => {
    const [colleges, setColleges] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [prn, setPrn] = useState("");
    // const [role, setRole] = useState("Student");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const role = user.role;

    useEffect(() => {
        axios
            .get("http://localhost:5134/api/auth/colleges", {
                withCredentials: true,
            })
            .then((res) => setColleges(res.data))
            .catch((err) => console.error("Error fetching colleges", err));
    }, []);

    const fetchFaculties = (collegeId) => {
        axios
            .get(
                `http://localhost:5134/api/auth/faculties?collegeId=${collegeId}`,
                {
                    withCredentials: true,
                }
            )
            .then((res) => setFaculties(res.data))
            .catch((err) => console.error("Error fetching faculties", err));
    };

    const fetchCourses = (facultyId) => {
        axios
            .get(
                `http://localhost:5134/api/auth/courses?facultyId=${facultyId}`,
                {
                    withCredentials: true,
                }
            )
            .then((res) => setCourses(res.data))
            .catch((err) => console.error("Error fetching courses", err));
    };

    const fetchClasses = (courseId) => {
        axios
            .get(
                `http://localhost:5134/api/auth/classes?courseId=${courseId}`,
                {
                    withCredentials: true,
                }
            )
            .then((res) => setClasses(res.data))
            .catch((err) => console.error("Error fetching classes", err));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCollege || !selectedFaculty) {
            setError("Please select a college and faculty.");
            return;
        }

        if (role === "student" && (!selectedCourse || !selectedClass)) {
            setError("Please select a course and class.");
            return;
        }

        const affiliationData = {
            role,
            collegeId: selectedCollege.value,
            facultyId: selectedFaculty.value,
            courseId: role === "student" ? selectedCourse?.value : null,
            classId: role === "student" ? selectedClass?.value : null,
            prn: role === "student" ? prn : null,
        };

        console.log("🔍 Sending affiliation data:", affiliationData);

        try {
            const res = await axios.post(
                "http://localhost:5134/api/auth/select-affiliation",
                affiliationData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            setError(null);
            setUser(res.data.user);
            navigate("/");
            alert(res.data.message);
        } catch (error) {
            console.error("❌ Error submitting affiliation", error);
            console.log("🔍 Server Response:", error.response?.data);
            if (error.response?.status === 401) {
                setError("Unauthorized: Please log in again.");
            } else if (error.response?.status === 400) {
                setError(
                    error.response?.data?.error ||
                        "Bad request. Please check your selections."
                );
            } else {
                setError(error.response?.data?.error || "An error occurred");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Select Affiliation
                </h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="space-y-4">
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role:
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            College:
                        </label>
                        <Select
                            options={colleges.map((c) => ({
                                value: c.collegeId,
                                label: c.collegeName,
                            }))}
                            onChange={(selected) => {
                                setSelectedCollege(selected);
                                fetchFaculties(selected.value);
                                setSelectedFaculty(null);
                                setSelectedCourse(null);
                                setSelectedClass(null);
                            }}
                            value={selectedCollege}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Faculty:
                        </label>
                        <Select
                            options={faculties.map((f) => ({
                                value: f.facultyId,
                                label: f.facultyName,
                            }))}
                            onChange={(selected) => {
                                setSelectedFaculty(selected);
                                fetchCourses(selected.value);
                                setSelectedCourse(null);
                                setSelectedClass(null);
                            }}
                            value={selectedFaculty}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {role === "student" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course:
                                </label>
                                <Select
                                    options={courses.map((c) => ({
                                        value: c.courseId,
                                        label: c.courseName,
                                    }))}
                                    onChange={(selected) => {
                                        setSelectedCourse(selected);
                                        fetchClasses(selected.value);
                                        setSelectedClass(null);
                                    }}
                                    value={selectedCourse}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class:
                                </label>
                                <Select
                                    options={classes.map((c) => ({
                                        value: c.classId,
                                        label: c.className,
                                    }))}
                                    onChange={setSelectedClass}
                                    value={selectedClass}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    PRN:
                                </label>
                                <input
                                    type="text"
                                    value={prn}
                                    onChange={(e) => setPrn(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AffiliationForm;
