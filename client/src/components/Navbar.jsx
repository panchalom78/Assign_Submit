import { FaBell, FaUser } from "react-icons/fa";
import useAuthStore from "../utils/AuthStore";
import { useNavigate } from "react-router";

const Navbar = ({ title }) => {
    
    return (
        <header className="fixed top-0 right-0 left-0 h-16 bg-gray-900/95 backdrop-blur-md border-b border-[#EB3678]/20 z-30 ">
            <div className="flex items-center justify-between h-full px-6 ml-0 md:ml-64">
                {/* Left side - Title */}
                <div className="flex items-center">
                    <h1 className="text-white font-bold text-xl">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#EB3678] to-[#FB773C] bg-clip-text text-transparent ml-12 md:ml-0">
                            {title}
                        </span>
                    </h1>
                </div>

                {/* Right side - User Info and Notifications */}
               
            </div>
        </header>
    );
};

export default Navbar;
