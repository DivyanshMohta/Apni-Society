import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import electrician_services from '../../../../frontend/src/pages/Services/ElectricianAdmin'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ElectricianAdmin" element={<electrician_services />} />
      </Routes>
    </Router>
  );
}

export default App;
