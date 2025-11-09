import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from './store/slices/authSlice';
import api from './utils/api';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ModsPage from './pages/ModsPage';
import ModDetail from './pages/ModDetail';
import Dashboard from './pages/Dashboard';
import RequestMod from './components/mods/RequestMod';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Maintenance from './pages/Maintenance';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppLayout() {
  const location = useLocation();
  const { darkMode } = useSelector((state) => state.ui);
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-otp';
  const isHomepage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isAuthPage && <Navbar />}
      <main className={`flex-1 ${isHomepage || isDashboard || isAuthPage ? 'pt-0' : 'pt-20'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/mods" element={<ModsPage />} />
          <Route path="/mods/:id" element={<ModDetail />} />
          <Route path="/request-mod" element={<RequestMod />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isDashboard && !isAuthPage && <Footer />}
    </div>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);
  const { token, user } = useSelector((state) => state.auth);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(setUser(response.data));
        } catch (error) {
          console.error('Failed to fetch user:', error);
          dispatch(logout());
        }
      }
    };
    
    const checkMaintenance = async () => {
      try {
        const response = await api.get('/admin/maintenance');
        setMaintenanceMode(response.data.maintenanceMode);
      } catch (error) {
        console.error('Failed to check maintenance status:', error);
      }
    };
    
    fetchUser();
    checkMaintenance();
  }, [dispatch, token]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Show maintenance page for non-admin users when maintenance mode is enabled
  if (maintenanceMode && (!user || user.role !== 'admin')) {
    return <Maintenance />;
  }

  return (
    <Router>
      <AppLayout />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#f9fafb' : '#111827',
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;