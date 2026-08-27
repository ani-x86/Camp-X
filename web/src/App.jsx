import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';

// A placeholder for Dashboard which isn't built yet
const DashboardPlaceholder = () => (
  <div className="container" style={{ padding: '40px 24px' }}>
    <h1>Dashboard</h1>
    <p>You are logged in.</p>
    <button className="secondary" onClick={() => {
      localStorage.removeItem('campx_token');
      localStorage.removeItem('campx_user');
      window.location.reload();
    }}>Log out</button>
  </div>
);

// Basic PrivateRoute for stubbing purposes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('campx_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <DashboardPlaceholder />
            </PrivateRoute>
          } 
        />
        {/* Redirect any unknown route to dashboard (which handles auth redirect) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
