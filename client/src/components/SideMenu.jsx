import React, { useState, useEffect } from "react";
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
    FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuthStore from "../utils/AuthStore";

const SideMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const isTeacher = user?.role === "teacher";

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Common menu items for both roles
    const commonMenuItems = [
        {
            label: "Dashboard",
            icon: <FaTachometerAlt />,
            onClick: () => navigate("/"),
        },
        {
            label: "Calendar View",
            icon: <FaCalendar />,
            onClick: () => navigate("/calendar-view"),
        },
        {
            label: "Chat",
            icon: <FaComments />,
            onClick: () => navigate("/chat"),
        },
        {
            label: "Profile",
            icon: <FaUser />,
            onClick: () => navigate("/profile"),
        },
    ];

    // Teacher-specific menu items
    const teacherMenuItems = [
        {
            label: "Assignment Management",
            icon: <FaClipboardList />,
            onClick: () => navigate("/teacher-assignments"),
        },
        {
            label: "Create Assignment",
            icon: <FaStar />,
            onClick: () => navigate("/create-assignments"),
        },
    ];

    // Student-specific menu items
    const studentMenuItems = [
        {
            label: "Assignments",
            icon: <FaClipboardList />,
            onClick: () => navigate("/create-assignment"),
        },
        {
            label: "Grades",
            icon: <FaStar />,
            onClick: () => navigate("/grades"),
        },
        {
            label: "Remarks",
            icon: <FaTasks />,
            onClick: () => navigate("/remarks"),
        },
    ];

    // Combine menu items based on role
    const menuItems = [
        ...commonMenuItems,
        ...(isTeacher ? teacherMenuItems : studentMenuItems),
        {
            label: "Logout",
            icon: <FaSignOutAlt />,
            onClick: handleLogout,
            className: "mt-auto text-red-400 hover:text-red-300",
        },
    ];

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
                {/* User Info Section */}
                <div className="mb-8 text-center">
                    <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                    <p className="text-gray-400 capitalize">{user?.role}</p>
                </div>

                {/* Menu Items */}
                <ul className="flex flex-col gap-2 h-[calc(100%-8rem)]">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition duration-300 cursor-pointer ${
                                item.className || ""
                            }`}
                            onClick={item.onClick}
                        >
                            {item.icon} {item.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;
