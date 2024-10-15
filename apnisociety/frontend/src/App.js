// App.js or your main routing file
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home'
import Startup from './pages/Startup';
import Dashboard from './pages/Dashboard';
import UserDetailsForm from './pages/UserDetailForm';
import NoticeBoard from './pages/Dashboard-components/noticeboard';
import GuestInOut from './pages/Dashboard-components/GuestInOut';
import AboutUs from './pages/Home-page-feat/aboutus';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Startup" element={<Startup />} />
                <Route path="/dashboard" element={
                    user ? <Dashboard /> : <Navigate to="/login" />
                } />
                <Route path="/detailform" element={
                    user ? <UserDetailsForm /> : <Navigate to="/login" />
                } />
                <Route path="/GuestInOut" element={<GuestInOut />}></Route>
                <Route path="/noticeboard" element={<NoticeBoard />}></Route>
                <Route path="/aboutus" element={<AboutUs />} />
            </Routes>
        </Router>
    );
};

export default App;
