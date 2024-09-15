import React from 'react';
import Startup from './pages/Startup'; // Adjust the path if necessary
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/home';
import UserDetailsForm from './pages/UserDetailForm';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Startup" element={<Startup />} />
                <Route path="/detailform" element={<UserDetailsForm/>} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
