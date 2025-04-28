import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const TeacherCard = () => {
    const [stats, setStats] = useState({
        totalAssignments: 0,
        totalSubmissions: 0,
        pendingGrading: 0,
        totalStudents: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get("/auth/teacher/stats");
                setStats({
                    totalAssignments: response.data.totalAssignments,
                    totalSubmissions: response.data.totalSubmissions,
                    pendingGrading: response.data.pendingGrading,
                    totalStudents: response.data.totalStudents,
                });
            } catch (error) {
                console.error("Error fetching teacher stats:", error);
            }
        };

        fetchStats();
    }, []);

    const cardTypes = [
        {
            id: 1,
            cname: "Total Assignments",
            number: stats.totalAssignments,
            color: "from-pink-500 to-rose-500",
        },
        {
            id: 2,
            cname: "Total Submissions",
            number: stats.totalSubmissions,
            color: "from-purple-500 to-indigo-500",
        },
        {
            id: 3,
            cname: "Pending Grading",
            number: stats.pendingGrading,
            color: "from-yellow-500 to-orange-500",
        },
        {
            id: 4,
            cname: "Total Students",
            number: stats.totalStudents,
            color: "from-green-500 to-teal-500",
        },
    ];

    return (
        <div className="flex flex-wrap justify-center items-center px-4 py-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 w-full h-auto">
            {cardTypes.map((card) => (
                <div
                    key={card.id}
                    className={`h-32 w-40 sm:h-36 sm:w-44 md:h-40 md:w-48 lg:h-44 lg:w-52 xl:h-48 xl:w-56 
                        bg-gradient-to-r ${card.color} text-white 
                        flex flex-col justify-center items-center rounded-lg shadow-lg 
                        transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {card.number}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-center mt-2">
                        {card.cname}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default TeacherCard;
