import React from 'react';
import Startup from './pages/Startup'; // Adjust the path if necessary
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/home';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Startup />} />
            </Routes>
        </Router>
    );
};

export default App;
