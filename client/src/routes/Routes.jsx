import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Home from "../sections/Home";
import Assignment from "../sections/AssignmentPage";
import Calendar from "../sections/Calendar";
import GradesPage from "../sections/GradesPage";
import RemarkPage from "../sections/RemarkPage";
import Chatpage from "../sections/Chatpage";
import Signup from "../sections/SignUpPage";
import Login from "../sections/LoginPage";
import { useAuthStore } from "../store/useAuthStore";
const Routers = () => {
    const { user } = useAuthStore();
    return (
        <div>
            <Router>
                <Routes>
                    <Route
                        path="/home"
                        element={user ? <Home /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/submition"
                        element={
                            user ? <Assignment /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/calendar-view"
                        element={user ? <Calendar /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/grades"
                        element={
                            user ? <GradesPage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/remarks"
                        element={
                            user ? <RemarkPage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/chat"
                        element={user ? <Chatpage /> : <Navigate to="/login" />}
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </div>
    );
};

export default Routers;
