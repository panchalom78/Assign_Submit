import React, { useState, useEffect } from "react";
import axios  from "axios";


function SelectAffiliation() {
    const [formData, setFormData] = useState({
        collegeId: "",
        facultyId: "",
        courseId: "",
        classId: "",
        role: "Student",
    });

    const [colleges, setColleges] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);

    const [error, setError] = useState(null);
    ;

    // Fetch colleges on component mount
    useEffect(() => {
        axios.get("/api/colleges")
            .then(response => setColleges(response.data))
            .catch(error => console.error("Error fetching colleges:", error));
    }, []);

    // Fetch faculties when college changes
    useEffect(() => {
        if (formData.collegeId) {
            axios.get(`/api/faculties?collegeId=${formData.collegeId}`)
                .then(response => setFaculties(response.data))
                .catch(error => console.error("Error fetching faculties:", error));
        }
    }, [formData.collegeId]);

    // Fetch courses when faculty changes
    useEffect(() => {
        if (formData.facultyId) {
            axios.get(`/api/courses?facultyId=${formData.facultyId}`)
                .then(response => setCourses(response.data))
                .catch(error => console.error("Error fetching courses:", error));
        }
    }, [formData.facultyId]);

    // Fetch classes when course changes
    useEffect(() => {
        if (formData.courseId) {
            axios.get(`/api/classes?courseId=${formData.courseId}`)
                .then(response => setClasses(response.data))
                .catch(error => console.error("Error fetching classes:", error));
        }
    }, [formData.courseId]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("userId"); // Store userId after login
            const response = await axiosInstance.post(`/api/users/${userId}/update-affiliation`, formData);
            console.log("Affiliation updated:", response.data);
            alert("Affiliation updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to update affiliation:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Something went wrong!");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Select Affiliation</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">College</label>
                    <select name="collegeId" value={formData.collegeId} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                        <option value="">Select College</option>
                        {colleges.map(college => (
                            <option key={college.id} value={college.id}>{college.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Faculty</label>
                    <select name="facultyId" value={formData.facultyId} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                        <option value="">Select Faculty</option>
                        {faculties.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                        ))}
                    </select>
                </div>

                {formData.role === "Student" && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Course</label>
                            <select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Class</label>
                            <select name="classId" value={formData.classId} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                                <option value="">Select Class</option>
                                {classes.map(classItem => (
                                    <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default SelectAffiliation;
