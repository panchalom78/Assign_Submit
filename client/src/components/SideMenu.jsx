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
            icon: <FaTachometerAlt className="text-[#FB773C]" />,
            onClick: () => navigate("/home"),
        },
        {
            label: "Calendar View",
            icon: <FaCalendar className="text-[#FB773C]" />,
            onClick: () => navigate("/calendar-view"),
        },
        {
            label: "Chat",
            icon: <FaComments className="text-[#FB773C]" />,
            onClick: () => navigate("/chat"),
        },
        {
            label: "Profile",
            icon: <FaUser className="text-[#FB773C]" />,
            onClick: () => navigate("/profile"),
        },
    ];

    // Teacher-specific menu items
    const teacherMenuItems = [
        {
            label: "Assignment Management",
            icon: <FaClipboardList className="text-[#FB773C]" />,
            onClick: () => navigate("/teacher-assignments"),
        },
        {
            label: "Create Assignment",
            icon: <FaStar className="text-[#FB773C]" />,
            onClick: () => navigate("/create-assignments"),
        },
    ];

    // Student-specific menu items
    const studentMenuItems = [
        {
            label: "Assignments",
            icon: <FaClipboardList className="text-[#FB773C]" />,
            onClick: () => navigate("/create-assignment"),
        },
        {
            label: "Grades",
            icon: <FaStar className="text-[#FB773C]" />,
            onClick: () => navigate("/grades"),
        },
        {
            label: "Remarks",
            icon: <FaTasks className="text-[#FB773C]" />,
            onClick: () => navigate("/remarks"),
        },
    ];

    // Combine menu items based on role
    const menuItems = [
        ...commonMenuItems,
        ...(isTeacher ? teacherMenuItems : studentMenuItems),
        {
            label: "Logout",
            icon: <FaSignOutAlt className="text-[#FB773C]" />,
            onClick: handleLogout,
            className: "mt-auto text-red-400 hover:text-red-300",
        },
    ];

    return (
        <div className="fixed top-0 left-0 z-40">
            {/* Toggle Button for Mobile */}
            <button
                onClick={toggleMenu}
                className="fixed top-4 left-4 p-3 bg-gradient-to-r from-[#EB3678] to-[#FB773C] text-white rounded-lg md:hidden z-50 hover:shadow-lg transition-all"
            >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Menu */}
            <div
                className={`fixed inset-y-0 left-0 h-screen w-64 bg-gray-900/95 backdrop-blur-md text-white p-6 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:relative md:w-64 border-r border-[#EB3678]/20`}
            >
                {/* User Info Section */}
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#EB3678] to-[#FB773C] flex items-center justify-center mb-4">
                        <FaUser className="text-white" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                        {user?.fullName}
                    </h2>
                    <p className="text-gray-400 capitalize">{user?.role}</p>
                </div>

                {/* Menu Items */}
                <ul className="flex flex-col gap-2 h-[calc(100%-12rem)]">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-3 hover:bg-[#EB3678]/10 p-3 rounded-lg transition duration-300 cursor-pointer hover:text-[#FB773C] border-l-4 border-transparent hover:border-[#FB773C] ${
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
