import React from 'react';
import Startup from './pages/Startup'; // Adjust the path if necessary
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Startup />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
