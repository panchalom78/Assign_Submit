import React from "react";
import { motion } from "framer-motion";
import AssignmentSubmission from "../components/Submition";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import SideMenu from "../components/SideMenu";

const Assignment = () => {
    return (
        <div className="min-h-screen bg-black mt-15">
            {/* Navbar */}
            <Navbar title="Dashboard" />

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-6 gap-6">
                {/* Sidebar Menu (Sticky on Desktop) */}
                <div className="w-full md:w-64 z-40">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="sticky top-24"
                    >
                        <SideMenu />
                    </motion.div>
                </div>

                {/* Main Content Area */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex-1"
                >
                    <AssignmentSubmission />
                </motion.div>
            </div>
        </div>
    );
};

export default Assignment;
