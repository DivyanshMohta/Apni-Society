import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import SecurityDashboard from './Login/SecurityDashboard';
import SecurityInOut from './SecurityInOut';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/security-dashboard" element={<SecurityInOut />} />
      </Routes>
    </Router>
  );
}

export default App;
