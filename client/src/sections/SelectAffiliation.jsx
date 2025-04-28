import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { FiArrowRight, FiLoader, FiHome, FiBook, FiUsers, FiAward } from "react-icons/fi";

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const role = user.role;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const buttonHover = {
        scale: 1.02,
        boxShadow: "0 5px 15px rgba(235, 54, 120, 0.4)"
    };

    const buttonTap = {
        scale: 0.98
    };

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
                { withCredentials: true }
            )
            .then((res) => setFaculties(res.data))
            .catch((err) => console.error("Error fetching faculties", err));
    };

    const fetchCourses = (facultyId) => {
        axios
            .get(
                `http://localhost:5134/api/auth/courses?facultyId=${facultyId}`,
                { withCredentials: true }
            )
            .then((res) => setCourses(res.data))
            .catch((err) => console.error("Error fetching courses", err));
    };

    const fetchClasses = (courseId) => {
        axios
            .get(
                `http://localhost:5134/api/auth/classes?courseId=${courseId}`,
                { withCredentials: true }
            )
            .then((res) => setClasses(res.data))
            .catch((err) => console.error("Error fetching classes", err));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!selectedCollege || !selectedFaculty) {
            setError("Please select a college and faculty.");
            setIsLoading(false);
            return;
        }

        if (role === "student" && (!selectedCourse || !selectedClass)) {
            setError("Please select a course and class.");
            setIsLoading(false);
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

        try {
            const res = await axios.post(
                "http://localhost:5134/api/auth/select-affiliation",
                affiliationData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setUser(res.data.user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting affiliation", error);
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
        } finally {
            setIsLoading(false);
        }
    };

    // Enhanced custom styles for react-select
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'rgba(55, 65, 81, 0.5)',
            borderColor: state.isFocused ? '#EB3678' : 'rgba(75, 85, 99, 0.3)',
            boxShadow: state.isFocused ? '0 0 0 1px #EB3678' : 'none',
            minHeight: '44px',
            borderRadius: '8px',
            '&:hover': {
                borderColor: '#EB3678'
            },
            cursor: 'pointer'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#EB3678' : 
                           state.isFocused ? 'rgba(235, 54, 120, 0.2)' : 
                           'rgba(31, 41, 55, 0.8)',
            color: state.isSelected ? 'white' : 'rgba(209, 213, 219)',
            padding: '10px 15px',
            fontSize: '14px',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: 'rgba(235, 54, 120, 0.3)'
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white'
        }),
        input: (provided) => ({
            ...provided,
            color: 'white'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'rgba(156, 163, 175)'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            border: '1px solid rgba(235, 54, 120, 0.3)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            marginTop: '4px',
            zIndex: 9999
        }),
        menuList: (provided) => ({
            ...provided,
            padding: 0,
            maxHeight: '250px',
            '&::-webkit-scrollbar': {
                width: '6px'
            },
            '&::-webkit-scrollbar-track': {
                background: 'rgba(31, 41, 55, 0.8)'
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#EB3678',
                borderRadius: '3px'
            }
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: 'rgba(156, 163, 175)',
            transition: 'transform 0.2s',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
            '&:hover': {
                color: 'white'
            }
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: 'rgba(156, 163, 175)',
            '&:hover': {
                color: 'white'
            }
        }),
        noOptionsMessage: (provided) => ({
            ...provided,
            color: 'rgba(209, 213, 219)',
            padding: '10px 15px'
        })
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md"
            >
                <div className="bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-[#EB3678]/20">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-[#EB3678] to-[#FB773C] p-6 text-center">
                        <motion.h2 
                            variants={itemVariants}
                            className="text-3xl font-bold text-white"
                        >
                            Complete Your Profile
                        </motion.h2>
                        <motion.p 
                            variants={itemVariants}
                            className="text-white/80 mt-2"
                        >
                            Select your academic affiliation
                        </motion.p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-8 space-y-4">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-900/20 text-red-300 border border-red-500/30 p-3 rounded-lg flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {error}
                            </motion.div>
                        )}
                        
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                <FiHome className="mr-2" /> College
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
                                styles={customStyles}
                                placeholder="Select your college..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                <FiBook className="mr-2" /> Faculty
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
                                styles={customStyles}
                                placeholder="Select your faculty..."
                                isDisabled={!selectedCollege}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                        </motion.div>

                        {role === "student" && (
                            <>
                                <motion.div 
                                    variants={itemVariants}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ 
                                        opacity: 1, 
                                        height: "auto",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                        <FiBook className="mr-2" /> Course
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
                                        styles={customStyles}
                                        placeholder="Select your course..."
                                        isDisabled={!selectedFaculty}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                </motion.div>

                                <motion.div 
                                    variants={itemVariants}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ 
                                        opacity: 1, 
                                        height: "auto",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                        <FiUsers className="mr-2" /> Class
                                    </label>
                                    <Select
                                        options={classes.map((c) => ({
                                            value: c.classId,
                                            label: c.className,
                                        }))}
                                        onChange={setSelectedClass}
                                        value={selectedClass}
                                        styles={customStyles}
                                        placeholder="Select your class..."
                                        isDisabled={!selectedCourse}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                </motion.div>

                                <motion.div 
                                    variants={itemVariants}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ 
                                        opacity: 1, 
                                        height: "auto",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                        <FiAward className="mr-2" /> PRN Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={prn}
                                            onChange={(e) => setPrn(e.target.value)}
                                            className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-[#EB3678] focus:border-[#EB3678] text-white placeholder-gray-400 transition"
                                            placeholder="Enter your PRN"
                                            required={role === "student"}
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}

                        <motion.button
                            variants={itemVariants}
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 mt-6 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#EB3678] to-[#FB773C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB3678] transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="animate-spin h-5 w-5 mr-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Complete Registration <FiArrowRight className="ml-2" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
                
                <motion.div 
                    variants={itemVariants}
                    className="mt-6 text-center text-sm text-gray-400"
                >
                    <p>© {new Date().getFullYear()} AssignMate. All rights reserved.</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AffiliationForm;