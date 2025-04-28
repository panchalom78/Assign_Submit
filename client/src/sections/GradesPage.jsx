import React from "react";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Grade from "../components/Grade";
import SideMenu from "../components/SideMenu";

const GradesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 mt-15">
            {/* Navbar */}
            <Navbar title="Grades" />

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 gap-6">
                {/* Sidebar Menu (Sticky on Desktop) */}
                <div className="w-full md:w-64 lg:w-72">
                    <div className="sticky top-20 z-40">
                        <SideMenu />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <Grade />
                </div>
            </div>
        </div>
    );
};

export default GradesPage;
