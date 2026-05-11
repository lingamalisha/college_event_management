import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyRegistrations from './pages/MyRegistrations';
import ManageEvents from './pages/ManageEvents';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/event/:id" element={<EventDetails />} />
                            <Route
                                path="/create-event"
                                element={
                                    <ProtectedRoute adminOnly={true}>
                                        <CreateEvent />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/edit-event/:id"
                                element={
                                    <ProtectedRoute adminOnly={true}>
                                        <EditEvent />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-registrations"
                                element={
                                    <ProtectedRoute>
                                        <MyRegistrations />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manage-events"
                                element={
                                    <ProtectedRoute adminOnly={true}>
                                        <ManageEvents />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
