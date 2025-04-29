import React from "react";
import { motion } from "framer-motion";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import "./home.css";

const Chatpage = () => {
    return (
        <div className="min-h-screen bg-black mt-15 overflow-hidden">
            {/* Navbar */}
            <Navbar title="Chat" />

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-6 gap-6">
                {/* Sidebar Menu (Sticky on Desktop) */}
                <div className="w-full md:w-64 z-40">
                    <SideMenu />
                </div>

                {/* Main Content Area */}

                <Chat />
            </div>
        </div>
    );
};

export default Chatpage;
