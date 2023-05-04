import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Landing from './components/layout/Landing';
import ProtectedRoute from './routing/ProtectedRoute';
import AuthContextProvider from './contexts/AuthContext';
import PostContextProvider from './contexts/PostContext';
import About from './views/About';

function App() {
    return (
        <AuthContextProvider>
            <PostContextProvider>
                <Router>
                    <Routes>
                        <Route path='/' element={<Landing />} />
                        <Route
                            path='/login'
                            element={<Auth authRoute='login' />}
                        />
                        <Route
                            path='/register'
                            element={<Auth authRoute='register' />}
                        />
                        <Route
                            path='/dashboard'
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path='/about' element={<About />} />
                    </Routes>
                </Router>
            </PostContextProvider>
        </AuthContextProvider>
    );
}

export default App;
