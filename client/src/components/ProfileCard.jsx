import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { User, Upload, CheckCircle, Settings, LogOut, Edit } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";


const ProfileSection = () => {
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        prn: "",
        collegeName: "",
        facultyName: "",
        courseName: "",
        className: "",
        profilePic: "",
        role: "",
        collegeId: "",
        facultyId: "",
        courseId: "",
        classId: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [colleges, setColleges] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    

    // Fetch profile data on component mount
    useEffect(() => {   
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const profileRes = await axiosInstance.get("/auth/profile", {
                    withCredentials: true,
                });
                
                if (profileRes.data?.user) {
                    const userData = profileRes.data.user;
                    const updates = {
                        fullName: userData.fullName,
                        email: userData.email,
                        prn: userData.prn,
                        role: userData.role,
                        profilePic: userData.profilePic,
                        collegeId: userData.collegeId,
                        facultyId: userData.facultyId,
                        courseId: userData.courseId,
                        classId: userData.classId
                    };

                    // Fetch all data in parallel where possible
                    const [
                        collegesRes,
                        collegeRes,
                        facultyRes,
                        courseRes,
                        classRes
                    ] = await Promise.all([
                        axiosInstance.get("/auth/colleges"),
                        userData.collegeId ? 
                            axiosInstance.get(`/auth/college-name?collegeId=${userData.collegeId}`) : 
                            Promise.resolve({ data: { collegeName: "" } }),
                        userData.facultyId ? 
                            axiosInstance.get(`/auth/faculty-name?facultyId=${userData.facultyId}`) : 
                            Promise.resolve({ data: { facultyName: "" } }),
                        userData.role === "student" && userData.courseId ? 
                            axiosInstance.get(`/auth/course-name?courseId=${userData.courseId}`) : 
                            Promise.resolve({ data: { courseName: "" } }),
                        userData.role === "student" && userData.classId ? 
                            axiosInstance.get(`/auth/class-name?classId=${userData.classId}`) : 
                            Promise.resolve({ data: { className: "" } })
                    ]);

                    updates.collegeName = collegeRes.data.collegeName;
                    updates.facultyName = facultyRes.data.facultyName;
                    updates.courseName = courseRes.data.courseName;
                    updates.className = classRes.data.className;

                    setColleges(collegesRes.data);

                    // Fetch dependent data if IDs exist
                    if (userData.collegeId) {
                        const facultiesRes = await axiosInstance.get(`/auth/faculties?collegeId=${userData.collegeId}`);
                        setFaculties(facultiesRes.data);
                    }

                    if (userData.role === "student" && userData.facultyId) {
                        const coursesRes = await axiosInstance.get(`/auth/courses?facultyId=${userData.facultyId}`);
                        setCourses(coursesRes.data);
                    }

                    if (userData.role === "student" && userData.courseId) {
                        const classesRes = await axiosInstance.get(`/auth/classes?courseId=${userData.courseId}`);
                        setClasses(classesRes.data);
                    }

                    setProfileData(updates);
                }
            } catch (err) {
                toast.error("Failed to load profile data");
                console.error("Error fetching profile data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    },[]);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            navigate("/login");
           
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
            console.error("Logout error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleCollegeChange = async (e) => {
        const collegeId = e.target.value;
        setProfileData(prev => ({ 
            ...prev, 
            collegeId,
            facultyId: "",
            courseId: "",
            classId: "",
            facultyName: "",
            courseName: "",
            className: ""
        }));

        try {
            const res = await axiosInstance.get(`/auth/faculties?collegeId=${collegeId}`);
            setFaculties(res.data);
            setCourses([]);
            setClasses([]);
            
            // Update college name in state
            const selectedCollege = colleges.find(c => c.collegeId === collegeId);
            if (selectedCollege) {
                setProfileData(prev => ({ 
                    ...prev, 
                    collegeName: selectedCollege.collegeName 
                }));
            }
        } catch (err) {
            toast.error("Failed to load faculties");
            console.error("Error fetching faculties", err);
        }
    };

    const handleFacultyChange = async (e) => {
        const facultyId = e.target.value;
        setProfileData(prev => ({ 
            ...prev, 
            facultyId,
            courseId: "",
            classId: "",
            courseName: "",
            className: ""
        }));

        // Update faculty name in state
        const selectedFaculty = faculties.find(f => f.facultyId === facultyId);
        if (selectedFaculty) {
            setProfileData(prev => ({ 
                ...prev, 
                facultyName: selectedFaculty.facultyName 
            }));
        }

        if (profileData.role === "student") {
            try {
                const res = await axiosInstance.get(`/auth/courses?facultyId=${facultyId}`);
                setCourses(res.data);
                setClasses([]);
            } catch (err) {
                toast.error("Failed to load courses");
                console.error("Error fetching courses", err);
            }
        }
    };

    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setProfileData(prev => ({ 
            ...prev, 
            courseId,
            classId: "",
            className: ""
        }));

        // Update course name in state
        const selectedCourse = courses.find(c => c.courseId === courseId);
        if (selectedCourse) {
            setProfileData(prev => ({ 
                ...prev, 
                courseName: selectedCourse.courseName 
            }));
        }

        try {
            const res = await axiosInstance.get(`/auth/classes?courseId=${courseId}`);
            setClasses(res.data);
        } catch (err) {
            toast.error("Failed to load classes");
            console.error("Error fetching classes", err);
        }
    };

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setProfileData(prev => ({ 
            ...prev, 
            classId,
            className: classes.find(c => c.classId === classId)?.className || ""
        }));
    };

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast.error("Image size should be less than 2MB");
            return;
        }

        if (!file.type.match("image.*")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setProfileData(prev => ({ 
                ...prev, 
                profilePic: event.target.result 
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            const payload = {
                fullName: profileData.fullName,
                email: profileData.email,
                password: profileData.password, // ✅ include this line
                collegeId: profileData.collegeId,
                facultyId: profileData.facultyId,
                ...(profileData.role === "student" && {
                    prn: profileData.prn,
                    courseId: profileData.courseId,
                    classId: profileData.classId,
                }),
            };
          
            const response = await axiosInstance.put("/auth/update-profile", payload );
    
            toast.success("Profile updated successfully");
            setEditMode(false);
    
            // Refresh profile data after update
            const profileRes = await axiosInstance.get("/auth/profile");
            if (profileRes.data?.user) {
                const userData = profileRes.data.user;
                setProfileData(prev => ({
                    ...prev,
                    fullName: userData.fullName,
                    email: userData.email,
                    prn: userData.prn,
                    role: userData.role,
                    profilePic: userData.profilePic,
                    collegeId: userData.collegeId,
                    facultyId: userData.facultyId,
                    courseId: userData.courseId,
                    classId: userData.classId
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            console.error("Update error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            View and manage your profile information
                        </p>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Settings"
                        >
                            <Settings className="h-6 w-6 text-gray-600" />
                        </button>

                        {showSettings && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button
                                    onClick={() => {
                                        setEditMode(!editMode);
                                        setShowSettings(false);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    {editMode ? "View Mode" : "Edit Profile"}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    <LogOut className="h-4 w-4 mr-2"
                                   
                                     />
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Profile Picture Section */}
                                <div className="flex-shrink-0">
                                    <div className="relative w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mx-auto">
                                        {profileData.profilePic ? (
                                            <img
                                                src={profileData.profilePic}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <User className="w-20 h-20" />
                                            </div>
                                        )}
                                        {editMode && (
                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                                <label className="cursor-pointer p-2 bg-white bg-opacity-80 rounded-full">
                                                    <Upload className="h-5 w-5 text-gray-700" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleProfilePicChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    {editMode && (
                                        <p className="mt-2 text-xs text-center text-gray-500">
                                            Click to upload new photo (max 2MB)
                                        </p>
                                    )}
                                </div>

                                {/* Profile Information Section */}
                                <div className="flex-grow">
                                    <div className="space-y-6">
                                        {/* Personal Information */}
                                        <div className="border-b border-gray-200 pb-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                <User className="mr-2 h-5 w-5 text-purple-600" />
                                                Personal Information
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ProfileField
                                                    label="Full Name"
                                                    name="fullName"
                                                    value={profileData.fullName}
                                                    editMode={editMode}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <ProfileField
                                                    label="Email"
                                                    name="email"
                                                    value={profileData.email}
                                                    editMode={editMode}
                                                    onChange={handleInputChange}
                                                    type="email"
                                                    required
                                                />
                                                {profileData.role === "student" && (
                                                    <ProfileField
                                                        label="PRN/Student ID"
                                                        name="prn"
                                                        value={profileData.prn}
                                                        editMode={editMode}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Academic Information */}
                                        <div className="pb-6">
                                            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                <CheckCircle className="mr-2 h-5 w-5 text-purple-600" />
                                                Academic Information
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ProfileSelectField
                                                    label="College"
                                                    name="collegeId"
                                                    value={profileData.collegeId}
                                                    options={colleges}
                                                    editMode={editMode}
                                                    onChange={handleCollegeChange}
                                                    optionValue="collegeId"
                                                    optionLabel="collegeName"
                                                    required
                                                />
                                                <ProfileSelectField
                                                    label="Faculty"
                                                    name="facultyId"
                                                    value={profileData.facultyId}
                                                    options={faculties}
                                                    editMode={editMode}
                                                    onChange={handleFacultyChange}
                                                    optionValue="facultyId"
                                                    optionLabel="facultyName"
                                                    required
                                                    disabled={!profileData.collegeId}
                                                />
                                                {profileData.role === "student" && (
                                                    <>
                                                        <ProfileSelectField
                                                            label="Course"
                                                            name="courseId"
                                                            value={profileData.courseId}
                                                            options={courses}
                                                            editMode={editMode}
                                                            onChange={handleCourseChange}
                                                            optionValue="courseId"
                                                            optionLabel="courseName"
                                                            required
                                                            disabled={!profileData.facultyId}
                                                        />
                                                        <ProfileSelectField
                                                            label="Class"
                                                            name="classId"
                                                            value={profileData.classId}
                                                            options={classes}
                                                            editMode={editMode}
                                                            onChange={handleClassChange}
                                                            optionValue="classId"
                                                            optionLabel="className"
                                                            required
                                                            disabled={!profileData.courseId}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {editMode && (
                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setEditMode(false)}
                                                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Saving...
                                                    </>
                                                ) : "Save Changes"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Reusable Profile Field Component
const ProfileField = ({ 
    label, 
    name, 
    value, 
    editMode, 
    onChange, 
    type = "text",
    required = false 
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {editMode ? (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    required={required}
                />
            ) : (
                <p className="mt-1 text-sm text-gray-900 font-medium">
                    {value || "Not specified"}
                </p>
            )}
        </div>
    );
};

// Reusable Profile Select Field Component
const ProfileSelectField = ({ 
    label, 
    name, 
    value, 
    options, 
    editMode, 
    onChange,
    optionValue,
    optionLabel,
    required = false,
    disabled = false
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {editMode ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${disabled ? 'bg-gray-100' : ''}`}
                    required={required}
                    disabled={disabled}
                >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map((option) => (
                        <option key={option[optionValue]} value={option[optionValue]}>
                            {option[optionLabel]}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="mt-1 text-sm text-gray-900 font-medium">
                    {options.find(opt => opt[optionValue] === value)?.[optionLabel] || "Not specified"}
                </p>
            )}
        </div>
    );
};

export default ProfileSection;