import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Home from "../sections/Home";
import Assignment from "../sections/AssignmentPage";
import Calendar from "../sections/Calendar";
import GradesPage from "../sections/GradesPage";
import RemarkPage from "../sections/RemarkPage";
import Chatpage from "../sections/Chatpage";
import Signup from "../sections/SignUpPage";
import Login from "../sections/LoginPage";
import SelectAffiliation from "../sections/SelectAffiliation";
import CreateAssignment from "../components/CreateAssignment";
import TeacherAssignments from "../sections/TeacherAssignments";
import AssignmentDetails from "../sections/AssignmentDetails";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSection from "../sections/profile";
import HomePage from "../sections/HomePage";
import TeacherHome from "../sections/TeacherHome";
import About from "../sections/About";
const Routers = () => {
    const { user } = useAuthStore();
    return (
        <div>
            <Router>
                <Routes>
                    <Route
                        path="/home"
                        element={
                            user?.role == "student" ? <Home /> : <TeacherHome />
                        }
                    />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/create-assignment" element={<Assignment />} />
                    <Route path="/calendar-view" element={<Calendar />} />
                    <Route path="/grades" element={<GradesPage />} />
                    <Route path="/remarks" element={<RemarkPage />} />
                    <Route path="/chat" element={<Chatpage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            user?.role === "student" ? (
                                <Home />
                            ) : (
                                <TeacherHome />
                            )
                        }
                    />
                    <Route
                        path="/select-affiliate"
                        element={<SelectAffiliation />}
                    />
                    <Route
                        path="/create-assignments"
                        element={<CreateAssignment />}
                    />
                    <Route
                        path="/teacher-assignments"
                        element={<TeacherAssignments />}
                    />
                    <Route
                        path="/assignment-details/:assignmentId"
                        element={<AssignmentDetails />}
                    />
                    <Route path="/profile" element={<ProfileSection />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Router>
        </div>
    );
};

export default Routers;
