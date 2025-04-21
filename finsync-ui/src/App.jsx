import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route path="/login" exact element={<Login/>} />
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expense" element={<Expense />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;

const Root = () => {
    // check if token exists in localStorage
    const isAuthenticated = localStorage.getItem('token');

    // Redirect to dashboard if authenticated, otherwise to login
    return isAuthenticated ? (
    <Navigate to="/dashboard" /> 
    ) :(
        <Navigate to="/login" />
    );
};