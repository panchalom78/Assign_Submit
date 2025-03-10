import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home  from "../sections/home";
import Assignment from "../sections/AssignmentPage";
import Calendar from "../sections/Calendar";
import GradesPage from "../sections/GradesPage";
import RemarkPage from "../sections/RemarkPage";
import Chatpage from "../sections/Chatpage";
const Routers = () => {
  return (
    <div>
       <Router>
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/submition" element={<Assignment/>} />
             <Route path="/calendar-view" element={<Calendar/>}/>
             <Route path="/grades" element={<GradesPage/>}/>
             <Route path="/remarks" element={<RemarkPage/>}/>
             <Route path="/chat" element={<Chatpage/>}/>
          </Routes>
       </Router>
    </div>
  )
}

export default Routers
