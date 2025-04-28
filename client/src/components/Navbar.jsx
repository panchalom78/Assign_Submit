import useAuthStore from "../utils/AuthStore";

const Navbar = () => {
    const { user } = useAuthStore();
    return (
        <header className="top-0 px-8 py-4 bg-gray-800 items-center text-center">
            <h1 className="text-white font-bold text-xl">
                {user?.role === "teacher" ? "Teacher  " : "Student  "}
                <span className="text-2xl font-bold text-green-300">
                    Dashboard
                </span>
            </h1>
        </header>
    );
};
export default Navbar;
