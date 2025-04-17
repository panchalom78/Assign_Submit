import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const ProfileSection = () => {
    const [colleges, setColleges] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [prn, setPrn] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch colleges on component mount
    useEffect(() => {
        axios
            .get("http://localhost:5134/api/auth/colleges", {
                withCredentials: true,
            })
            .then((res) => setColleges(res.data))
            .catch((err) => console.error("Error fetching colleges", err));
    }, []);

    // Fetch faculties based on selected college
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

    // Fetch courses based on selected faculty
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

    // Handle profile picture upload
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !name ||
            !email ||
            !prn ||
            !selectedCollege ||
            !selectedFaculty ||
            !selectedCourse
        ) {
            setError("Please fill all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("prn", prn);
        formData.append("collegeId", selectedCollege.value);
        formData.append("facultyId", selectedFaculty.value);
        formData.append("courseId", selectedCourse.value);
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }

        try {
            const res = await axios.post(
                "http://localhost:5134/api/auth/profile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            setError(null);
            setSuccess("Profile updated successfully!");
            console.log("Profile data:", res.data);
        } catch (error) {
            console.error("Error updating profile", error);
            setError(
                error.response?.data?.error ||
                    "An error occurred. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Your Profile
                </h2>
                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-sm mb-4 text-center">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex justify-center">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                className="hidden"
                            />
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-purple-500 transition-all">
                                {profilePic ? (
                                    <img
                                        src={URL.createObjectURL(profilePic)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">
                                        Upload
                                    </span>
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* PRN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PRN
                        </label>
                        <input
                            type="text"
                            value={prn}
                            onChange={(e) => setPrn(e.target.value)}
                            placeholder="Enter your PRN"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* College Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            College
                        </label>
                        <Select
                            options={colleges.map((c) => ({
                                value: c.collegeId,
                                label: c.collegeName,
                            }))}
                            onChange={(selected) => {
                                setSelectedCollege(selected);
                                fetchFaculties(selected.value);
                            }}
                            value={selectedCollege}
                            placeholder="Select your college"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Faculty Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Faculty
                        </label>
                        <Select
                            options={faculties.map((f) => ({
                                value: f.facultyId,
                                label: f.facultyName,
                            }))}
                            onChange={(selected) => {
                                setSelectedFaculty(selected);
                                fetchCourses(selected.value);
                            }}
                            value={selectedFaculty}
                            placeholder="Select your faculty"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Course Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course
                        </label>
                        <Select
                            options={courses.map((c) => ({
                                value: c.courseId,
                                label: c.courseName,
                            }))}
                            onChange={(selected) => setSelectedCourse(selected)}
                            value={selectedCourse}
                            placeholder="Select your course"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                    >
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSection;
