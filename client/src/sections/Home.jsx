import React from "react";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Card from "../components/Card";
import AssignmentTable from "../components/AssignmentTable";

const Home = () => {
    return (
        <div className="h-full w-full bg-black">
            <Navbar />

            <div className="flex flex-wrap  items-start gap-4 px-4">
                <Menu />
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
