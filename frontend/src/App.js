
import Missingcard from './components/find_loc/Missingcard';
import MissingList from './components/find_loc/MissingList';
// import SearchButton from './components/find_loc/SearchButton';
import Home from './components/Home/Home';
import Formmissing from './components/missing form/Formmissing';
import Navbar from './components/Navbar';
import PersonCard from "./components/missing_list/PersonCard"
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
            <Route path="/Formmissing" element={
              <ProtectedRoute>
                <Formmissing/>
              </ProtectedRoute>
            } />
            <Route path="/Missingpeople" element={
              <ProtectedRoute>
                <Missing_persons/>
              </ProtectedRoute>
            } />
            <Route path="/locations" element={
              <ProtectedRoute>
                <MissingList/>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
