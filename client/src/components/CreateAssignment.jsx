import React, { useState } from "react";
import {
    Book,
    GraduationCap,
    Calendar,
    FileText,
    ClipboardList,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

function CreateAssignment() {
    const [formData, setFormData] = useState({
        classId: "",
        title: "",
        description: "",
        dueDate: "",
    });

    const courses = [
        "Computer Science",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
    ];

    const classes = ["Class A", "Class B", "Class C", "Class D", "Class E"];

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const data = {
                ...formData,
                submittedOn: new Date().toISOString(),
                dueDate: new Date(formData.dueDate).toISOString(),
            };
            console.log("Submitted:", formData);
            const response = await axiosInstance.post("/assignment", data);
            // Handle form submission here
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-center mb-8">
                        <ClipboardList className="h-10 w-10 text-indigo-600" />
                        <h1 className="ml-3 text-3xl font-bold text-gray-900">
                            Assignment Submission
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Book className="h-4 w-4 mr-1" />
                                    Course
                                </label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((course, index) => (
                                        <option key={course} value={index + 1}>
                                            {course}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <GraduationCap className="h-4 w-4 mr-1" />
                                    Class
                                </label>
                                <select
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls, index) => (
                                        <option key={cls} value={index + 1}>
                                            {cls}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <FileText className="h-4 w-4 mr-1" />
                                Assignment Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter assignment title"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter assignment description"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Submit Assignment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAssignment;
