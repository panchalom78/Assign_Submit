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

const Routers = () => {
    
    return (
        <div>
            <Router>
                <Routes>
                    <Route
                        path="/home"
                        element={  <Home /> }
                    />
                    <Route
                        path="/submition"
                        element={
                            <Assignment /> 
                        }
                    />
                    <Route
                        path="/calendar-view"
                        element={<Calendar /> }
                    />
                    <Route
                        path="/grades"
                        element={
                            <GradesPage /> 
                        }
                    />
                    <Route
                        path="/remarks"
                        element={
                            <RemarkPage /> 
                        }
                    />
                    <Route
                        path="/chat"
                        element={ <Chatpage />}
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/select-affiliate" element={<SelectAffiliation/>} />
                </Routes>
            </Router>
        </div>
    );
};

export default Routers;
