import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from './contexts/AuthContext';
import MissingList from './components/find-loc/MissingList';
// import SearchButton from './components/find_loc/SearchButton';
import Formmissing from './components/missing-form/Formmissing';
import Navbar from './components/auth/Navbar';
import Missing_persons from './components/view-missing/Missing_persons';
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
                <Missing_persons/>
              </ProtectedRoute>
            } />
            <Route path="/missinglocations" element={
              <ProtectedRoute>
                <AddMissingArea/>
              </ProtectedRoute>
            } />
            <Route path="/locations" element={
              <ProtectedRoute>
                <MissingList/>
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
