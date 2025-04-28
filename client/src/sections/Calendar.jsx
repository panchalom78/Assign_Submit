import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import CalendarView from "../components/CelenderView";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import SideMenu from "../components/SideMenu";

const Calendar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axiosInstance.get(
                    "/assignment/calendar"
                );
                setAssignments(response.data.assignments);
            } catch (error) {
                console.error("Error fetching assignments:", error);
                toast.error("Failed to load assignments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div className="min-h-screen bg-black">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 gap-6 z-0">
                {/* Sidebar Menu (Sticky on Desktop) */}
                <div className="w-full md:w-64 lg:w-72">
                    <div className="sticky top-20 z-10">
                        <SideMenu />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 z-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <CalendarView assignments={assignments} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
