import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";

const Card = () => {
    const [stats, setStats] = useState({
        totalAssignments: 0,
        pendingAssignments: 0,
        submittedAssignments: 0,
        averageMarks: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get("/student/assignments");
                const assignments = response.data.assignments;

                const total = assignments.length;
                const submitted = assignments.filter(a => a.isSubmitted).length;
                const pending = total - submitted;

                const totalMarks = assignments.reduce((sum, assignment) => {
                    return sum + (assignment.submission?.marks || 0);
                }, 0);
                const averageMarks = submitted > 0 ? Math.round(totalMarks / submitted) : 0;

                setStats({
                    totalAssignments: total,
                    pendingAssignments: pending,
                    submittedAssignments: submitted,
                    averageMarks: averageMarks,
                });
            } catch (error) {
                console.error("Error fetching assignments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const cardTypes = [
        { 
            id: 1, 
            cname: "Total Assignments", 
            number: stats.totalAssignments,
            bg: "bg-[#FAF9F6]"
        },
        { 
            id: 2, 
            cname: "Pending Assignments", 
            number: stats.pendingAssignments,
            bg: "bg-[#FAF9F6]  "      
        },
        { 
            id: 3, 
            cname: "Submitted Assignments", 
            number: stats.submittedAssignments,
            bg: "bg-[#FAF9F6]"
        },
        { 
            id: 4, 
            cname: "Average Marks", 
            number: `${stats.averageMarks}%`,
            bg: "bg-[#FAF9F6]"
        },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-wrap justify-center items-center px-4 py-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full h-auto">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="h-32 w-48 sm:h-36 sm:w-56 md:h-40 md:w-64 bg-gray-800 rounded-xl shadow-md animate-pulse"
                    ></div>
                ))}
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center  teitems-center px-4 py-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full h-auto"
        >
            {cardTypes.map((card) => (
                <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.05 }}
                    className={`${card.bg} h-32 w-48 sm:h-36 sm:w-56 md:h-40 md:w-64 p-4 text-black flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                        {card.number}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-center font-medium">
                        {card.cname}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default Card;