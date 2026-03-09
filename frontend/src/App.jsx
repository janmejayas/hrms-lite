import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        HRMS Lite
      </div>
      <ul className="nav-links">
        <li><Link to="/" className={`nav-link ${isActive('/')}`}>Dashboard</Link></li>
        <li><Link to="/employees" className={`nav-link ${isActive('/employees')}`}>Employees</Link></li>
        <li><Link to="/attendance" className={`nav-link ${isActive('/attendance')}`}>Attendance</Link></li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
