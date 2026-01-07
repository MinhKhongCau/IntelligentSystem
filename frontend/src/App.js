import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from './contexts/AuthContext';
import LocationsMissingList from "./components/find-loc/locations-missinglist";
// import SearchButton from './components/find_loc/SearchButton';
import Formmissing from './components/missing-form/Formmissing';
import Navbar from './components/auth/Navbar';
import MissingPersonsPage from './components/view-missing/MissingPersonsPage';
import Hero from './components/Hero/Hero';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import EditProfile from './components/auth/EditProfile';
import AddMissingArea from './components/missing-form/AddmissingArea';
import RegisterCarePartner from './components/carePartner/RegisterCarePartner';
import PoliceDashboard from './components/dashboard/PoliceDashboard';
import ManageAccounts from './components/police/ManageAccounts';
import ManageMissingList from './components/police/ManageMissingList';
import ManageReportedDocuments from './components/carePartner/ManageReportedDocument';
import MissingDocumentEditPage from './components/carePartner/MissingDocumentEditPage';
import SubscribedDocuments from './components/view-missing/SubscribedDocuments';
import MissingReports from './components/carePartner/MissingReports';
import MissingDocumentDetail from './components/view-missing/MissingDocumentDetail';
import CCTVMonitor from './components/police/CCTVMonitor';
import CCTVReportPage from './components/police/CCTVReportPage';
import MyReports from './components/carePartner/MyReports';
import MyReportEdit from './components/carePartner/MyReportEdit';
import MyFoundCases from './components/volunteer/MyFoundCases';
import EditFoundCase from './components/volunteer/EditFoundCase';
import ManageCamera from './components/manage-camera/ManageCameras';
import AllVolunteers from './components/volunteer/AllVolunteers';
import VolunteerDetail from './components/volunteer/VolunteerDetail';
import Statistics from './components/police/Statistics';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg h-auto">
          <Navbar/>
          <Routes>   
            <Route path="/" element={<Hero/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <EditProfile/>
              </ProtectedRoute>
            } />
            <Route path="/formmissing" element={
              <ProtectedRoute>
                <Formmissing/>
              </ProtectedRoute>
            } />
            <Route path="/missingpeople" element={
              <ProtectedRoute>
                <MissingPersonsPage/>
              </ProtectedRoute>
            } />
            <Route path="/missinglocations" element={
              <ProtectedRoute>
                <AddMissingArea/>
              </ProtectedRoute>
            } />
            <Route path="/locations" element={
              <ProtectedRoute>
                <LocationsMissingList/>
              </ProtectedRoute>
            } />
            <Route path="/register-care-partner" element={
              <ProtectedRoute>
                <RegisterCarePartner/>
              </ProtectedRoute>
            } />
            <Route path="/police-dashboard" element={
              <ProtectedRoute>
                <PoliceDashboard/>
              </ProtectedRoute>
            } />
            <Route path="/manage-accounts" element={
              <ProtectedRoute>
                <ManageAccounts/>
              </ProtectedRoute>
            } />
            <Route path="/manage-missing-forms" element={
              <ProtectedRoute>
                <ManageMissingList/>
              </ProtectedRoute>
            } />
            <Route path="/manage-reported-documents" element={
              <ProtectedRoute>
                <ManageReportedDocuments/>
              </ProtectedRoute>
            } />
            <Route path="/manage-reported-documents/:id" element={
              <ProtectedRoute>
                <MissingDocumentEditPage/>
              </ProtectedRoute>
            } />
            <Route path="/my-subscriptions" element={
              <ProtectedRoute>
                <SubscribedDocuments/>
              </ProtectedRoute>
            } />
            <Route path="/missing-reports/:id" element={
              <ProtectedRoute>
                <MissingReports/>
              </ProtectedRoute>
            } />
            <Route path="/missing-document/:id" element={
              <ProtectedRoute>
                <MissingDocumentDetail/>
              </ProtectedRoute>
            } />
            <Route path="/police/cctv-monitor" element={
              <ProtectedRoute>
                <CCTVMonitor/>
              </ProtectedRoute>
            } />
            <Route path="/police/cctv-report" element={
              <ProtectedRoute>
                <CCTVReportPage/>
              </ProtectedRoute>
            } />
            <Route path="/my-reports" element={
              <ProtectedRoute>
                <MyReports/>
              </ProtectedRoute>
            } />
            <Route path="/my-reports/edit/:id" element={
              <ProtectedRoute>
                <MyReportEdit/>
              </ProtectedRoute>
            } />
            <Route path="/my-found-cases" element={
              <ProtectedRoute>
                <MyFoundCases/>
              </ProtectedRoute>
            } />
            <Route path="/my-found-cases/edit/:reportId" element={
              <ProtectedRoute>
                <EditFoundCase/>
              </ProtectedRoute>
            } />
            <Route path="/manage-camera" element={
              <ProtectedRoute>
                <ManageCamera/>
              </ProtectedRoute>
            } />
            <Route path="/volunteers" element={
              <ProtectedRoute>
                <AllVolunteers/>
              </ProtectedRoute>
            } />
            <Route path="/volunteers/:id" element={
              <ProtectedRoute>
                <VolunteerDetail/>
              </ProtectedRoute>
            } />
            <Route path="/statistics" element={
              <ProtectedRoute>
                <Statistics/>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
