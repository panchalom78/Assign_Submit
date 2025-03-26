import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Card = () => {
    const [stats, setStats] = useState({
        totalAssignments: 0,
        pendingAssignments: 0,
        submittedAssignments: 0,
        averageMarks: 0,
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axiosInstance.get(
                    "/student/assignments"
                );
                const assignments = response.data.assignments;

                // Calculate statistics
                const total = assignments.length;
                const submitted = assignments.filter(
                    (a) => a.isSubmitted
                ).length;
                const pending = total - submitted;

                // Calculate average marks for submitted assignments
                const totalMarks = assignments.reduce((sum, assignment) => {
                    return sum + (assignment.submission?.marks || 0);
                }, 0);
                const averageMarks =
                    submitted > 0 ? Math.round(totalMarks / submitted) : 0;

                setStats({
                    totalAssignments: total,
                    pendingAssignments: pending,
                    submittedAssignments: submitted,
                    averageMarks: averageMarks,
                });
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchAssignments();
    }, []);

    const cardTypes = [
        { id: 1, cname: "Total Assignments", number: stats.totalAssignments },
        {
            id: 2,
            cname: "Pending Assignments",
            number: stats.pendingAssignments,
        },
        {
            id: 3,
            cname: "Submitted Assignments",
            number: stats.submittedAssignments,
        },
        { id: 4, cname: "Average Marks", number: `${stats.averageMarks}%` },
    ];

    return (
        <div className="flex flex-wrap justify-center items-center px-4 py-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 w-full h-auto">
            {cardTypes.map((card) => (
                <div
                    key={card.id}
                    className="h-32 w-40 sm:h-36 sm:w-44 md:h-40 md:w-48 lg:h-44 lg:w-52 xl:h-48 xl:w-56 bg-cyan-300 text-white flex flex-col justify-center items-center rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {card.number}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-center">
                        {card.cname}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Card;
