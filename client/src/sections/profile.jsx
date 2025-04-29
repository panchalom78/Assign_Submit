import React from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import SideMenu from "../components/SideMenu";

const profile = () => {
    return (
        <div className="h-auto w-full bg-black mt-15">
            <Navbar title="Profile" />

    <div className="flex flex-wrap  items-start gap-4 px-4">
        <SideMenu />
    </div>
    <div className="md:ml-70 h-auto w-auto bg-black">
        <ProfileCard />
    </div>
</div>
  )
}

export default profile;
