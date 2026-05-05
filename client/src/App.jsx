import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Hexagon, Menu } from 'lucide-react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import NotificationBell from './components/NotificationBell';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const NavItem = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link 
      to={to} 
      className={`text-xs font-sans tracking-wide transition-colors duration-200 hover:text-black
        ${isActive ? 'text-black font-medium' : 'text-apple-grayDark'}`}
    >
      {label}
    </Link>
  );
};




const LayoutWrapper = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  if (!user || isAuthPage) return children;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Apple-style Global Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 apple-nav-glass h-[44px] flex items-center justify-center">
        <div className="w-full max-w-[980px] px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity">
            <Hexagon size={16} fill="currentColor" />
            <span className="text-[15px] font-semibold tracking-tight font-display">TeamFlow AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <NavItem to="/" label="Dashboard" />
            <NavItem to="/projects" label="Projects" />
            <NavItem to="/profile" label="Settings" />
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-apple-grayDark">{user.name}</span>
              <button onClick={logout} className="text-xs text-apple-grayDark hover:text-black transition-colors">
                Log out
              </button>
            </div>
            <button className="md:hidden text-black">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 mt-[44px] w-full max-w-[980px] mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <LayoutWrapper>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </LayoutWrapper>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              color: '#1d1d1f',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              fontSize: '14px',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
