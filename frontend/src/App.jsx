import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UpcomingWorks from "./pages/UpcomingWorks";

import WorkingProgress from "./pages/WorkingProgress";
import PaymentsDue from "./pages/PaymentsDue";
import History from "./pages/History";
import TeamMembers from "./pages/TeamMembers";
import Profit from "./pages/Profit";
import AddProjects from "./pages/projects/AddProjects";
import ProjectDetails from "./pages/projects/ProjectDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects/upcoming" element={<UpcomingWorks />} />
          <Route path="projects/in-progress" element={<WorkingProgress />} />
          <Route path="projects/payments-due" element={<PaymentsDue />} />
          <Route path="projects/history" element={<History />} />
          <Route path="team-members" element={<TeamMembers />} />
          <Route path="profit" element={<Profit />} />
          <Route path="projects/add" element={<AddProjects />} />
<Route path="projects/in-progress/:id" element={<ProjectDetails />} />   

     </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;