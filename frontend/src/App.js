
import MissingList from './components/find_loc/MissingList';
// import SearchButton from './components/find_loc/SearchButton';
import Formmissing from './components/missing form/Formmissing';
import Navbar from './components/Navbar';
import Missing_persons from './components/missing_list/Missing_persons';
import Hero from './components/Hero/Hero';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Register from './components/auth/Register';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import AddMissingArea from './components/missing form/AddmissingArea';
import RegisterCarePartner from './components/role/carePartner/RegisterCarePartner';
import PoliceDashboard from './components/role/police/PoliceDashboard';
import ManageAccounts from './components/role/police/ManageAccounts';
import ManageMissingList from './components/role/police/ManageMissingList';
import ManageReportedDocuments from './components/role/carePartner/ManageReportedDocument';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
