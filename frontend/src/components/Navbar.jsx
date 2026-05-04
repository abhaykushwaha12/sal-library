import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCircle, LogIn } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: user?.role === 'admin' ? '/admin' : '/student', protected: true },
    { name: 'About SAL', path: '/about' },
  ];

  return (
    <nav className="glass-panel sticky top-4 z-40 mx-4 mb-8 px-6 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-100">
          <img src="/WhatsApp Image 2026-05-03 at 6.27.39 PM.jpeg" alt="SAL Logo" className="h-10 w-auto object-contain" />
        </div>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          if (link.protected && !user) return null;
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <Link 
              key={link.path}
              to={link.path}
              className={`relative py-2 text-sm font-bold transition-all ${isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
            >
              {link.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: User Profile / Login */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/profile')}
              className="p-1.5 rounded-full hover:bg-primary/10 text-slate-600 hover:text-primary transition-all flex items-center gap-2"
              title="My Profile"
            >
              <span className="text-sm font-bold hidden sm:block">{user.name || 'User'}</span>
              <UserCircle size={32} strokeWidth={1.5} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-md hover:shadow-primary/30"
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

