import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import TeacherCard from "../components/TeacherCard";
import TeacherAssignmentTable from "../components/TeacherAssignmentTable";
import useAuthStore from "../utils/AuthStore";

const TeacherHome = () => {
    const { getUserDetails } = useAuthStore();
    useEffect(() => {
        getUserDetails();
    }, []);
    return (
        <div className="h-screen w-full bg-white mt-15">
            <Navbar title="Dashboard" />

            <div className="flex flex-wrap items-start gap-4 px-4">
                <SideMenu />
                <div className="md:ml-80 h-auto md:mt-0 w-full md:w-auto flex flex-wrap space-y-0">
                    <TeacherCard />
                </div>
            </div>
            <div className="md:ml-70 h-auto w-auto">
                <TeacherAssignmentTable />
            </div>
        </div>
    );
};

export default TeacherHome;
