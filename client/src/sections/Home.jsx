import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";
import Card from "../components/Card";
import AssignmentTable from "../components/AssignmentTable";
import useAuthStore from "../utils/AuthStore";

const Home = () => {
    const { getUserDetails } = useAuthStore();
    useEffect(() => {
        getUserDetails();
    }, []);
    return (
        <div className="h-full w-full bg-black">
            <Navbar />

            <div className="flex flex-wrap items-start gap-4 px-4">
                <SideMenu />
                <div className="md:ml-80 h-auto md:mt-0 w-full md:w-auto flex flex-wrap space-y-0">
                    <Card />
                </div>
            </div>
            <div className="md:ml-70 h-auto w-auto">
                <AssignmentTable />
            </div>
        </div>
    );
};

export default Home;
