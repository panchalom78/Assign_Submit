import React, { useState } from "react";
import {
    FaBars,
    FaTimes,
    FaTachometerAlt,
    FaTasks,
    FaUser,
    FaComments,
    FaStar,
    FaClipboardList,
    FaCalendar,
    FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router";



const TeacherMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const navigate = useNavigate();

    const handleHome = () => {
        navigate("/dashboard");
    };
    const handleAssignment = () => {
        navigate("/create-assignment");
    };
    const handleCalendar = () => {
        navigate("/calendar-view");
    };
    const handleRemarks = () => {
        navigate("/remarks");
    };
    const handleGrades = () => {
        navigate("/grades");
    };
    const handleChat = () => {
        navigate("/chat");
    };
    const handleProfile = () => {
        navigate("/profile");
    };
    return (
        <div className="fixed top-0 left-0 z-40">
            {/* Toggle Button for Mobile */}
            <button
                onClick={toggleMenu}
                className="fixed top-4 left-4 p-3 bg-gray-800 text-white rounded-lg md:hidden z-50"
            >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Menu */}
            <div
                className={`fixed inset-y-0 left-0 h-screen w-64 bg-gray-900 text-white p-6 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:relative md:w-64`}
            >
                <ul className="flex flex-col gap-6">
                    <li
                        className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer"
                        onClick={handleHome}
                    >
                        <FaTachometerAlt /> Dashboard
                    </li>
                    <li
                        className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer"
                        onClick={handleAssignment}
                    >
                        <FaClipboardList /> Assignment
                    </li>
                    <li
                        className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer"
                        onClick={handleGrades}
                    >
                        <FaStar /> Grades
                    </li>
                    <li
                        className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer"
                        onClick={handleRemarks}
                    >
                        <FaTasks /> Remark
                    </li>
                    <li
                        className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer"
                        onClick={handleCalendar}
                    >
                        <FaCalendar /> Calender View
                    </li>

                    <li
                        className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer"
                        onClick={handleChat}
                    >
                        <FaComments /> Chat
                    </li>
                    <li className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer"
                    onClick={handleProfile}
                    >

                        <FaUser /> Profile
                    </li>
                   
                </ul>
            </div>
        </div>
    );
};

export default TeacherMenu;
