
import Missingcard from './components/find_loc/Missingcard';
import MissingList from './components/find_loc/MissingList';
import Home from './components/Home/Home';
import Formmissing from './components/missing form/Formmissing';
import Navbar from './components/navbar/Navbar';
import PersonCard from "./components/missing_list/PersonCard"
import Missing_persons from './components/missing_list/Missing_persons';
import Hero from './components/Hero/Hero';

// Authentication components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';

// Dashboard components
import PoliceDashboard from './components/dashboard/PoliceDashboard';
import CarePartnerDashboard from './components/dashboard/CarePartnerDashboard';
import VolunteerDashboard from './components/dashboard/VolunteerDashboard';

// Management components
import CaseManagement from './components/management/CaseManagement';
import VolunteerCoordination from './components/management/VolunteerCoordination';
import CCTVManagement from './components/management/CCTVManagement';
import AreaManagement from './components/management/AreaManagement';

// Search components
import AdvancedSearch from './components/search/AdvancedSearch';

// Reports components
import Reports from './components/reports/Reports';
import CCTVReports from './components/reports/CCTVReports';

// Settings components
import Settings from './components/settings/Settings';
import UserManagement from './components/settings/UserManagement';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
function App() {
  return (
    <div>
     
      {/* <Navbar/> */}
       {/* <Formmissing/> */}
      {/* <Home/> */}
      {/* <Missingcard/> */}
      {/* <MissingList/> */}
      {/* <SearchButton/> */}
      {/* <PersonCard/> */}
      
      {/* <Navbar/> */}
      {/* <Missing_persons/> */}
      {/* <Hero/> */}
      <Router>
        <Navbar/>
      
        <Routes>   
          {/* Public Routes */}
          <Route path="/" element={<Hero/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          
          {/* Dashboard Routes */}
          <Route path="/police-dashboard" element={<PoliceDashboard/>} />
          <Route path="/care-partner-dashboard" element={<CarePartnerDashboard/>} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard/>} />
          
          {/* Management Routes */}
          <Route path="/case-management" element={<CaseManagement/>} />
          <Route path="/volunteer-coordination" element={<VolunteerCoordination/>} />
          <Route path="/cctv-management" element={<CCTVManagement/>} />
          <Route path="/area-management" element={<AreaManagement/>} />
          
          {/* Search Routes */}
          <Route path="/search" element={<AdvancedSearch/>} />
          
          {/* Reports Routes */}
          <Route path="/reports" element={<Reports/>} />
          <Route path="/cctv-reports" element={<CCTVReports/>} />
          
          {/* Settings Routes */}
          <Route path="/settings" element={<Settings/>} />
          <Route path="/user-management" element={<UserManagement/>} />
          <Route path="/profile" element={<Profile/>} />
          
          {/* Original Routes */}
          <Route path="/Formmissing" element={<Formmissing/>} />
          <Route path="/Missingpeople" element={<Missing_persons/>} />
          <Route path="/locations" element={<MissingList/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
