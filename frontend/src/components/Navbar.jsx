import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCircle, LogIn, Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: user?.role === 'admin' ? '/admin' : '/student', protected: true },
    { name: 'About SAL', path: '/about' },
  ];

  const filteredLinks = navLinks.filter(link => !link.protected || user);

  return (
    <nav className="glass-panel sticky top-4 z-40 mx-4 mb-8 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-100">
            <img src="/WhatsApp Image 2026-05-03 at 6.27.39 PM.jpeg" alt="SAL Logo" className="h-8 sm:h-10 w-auto object-contain" />
          </div>
          <span className="ml-3 font-black text-slate-800 text-lg hidden lg:block uppercase tracking-tighter">SAL Education</span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm font-bold transition-all ${isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
              >
                {link.name}
                {isActive && (
                  <motion.div layoutId="navline" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: User Profile / Login / Hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/profile')}
                  className="p-1.5 rounded-full hover:bg-primary/10 text-slate-600 hover:text-primary transition-all flex items-center gap-2"
                  title="My Profile"
                >
                  <span className="text-sm font-bold hidden sm:block">{user.name?.split(' ')[0] || 'User'}</span>
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

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-2 border-t border-slate-100 mt-3">
              {filteredLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-slate-100">
                {user ? (
                  <div className="space-y-2">
                    <button 
                      onClick={() => { navigate('/profile'); setIsOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl text-slate-700 font-bold"
                    >
                      <div className="flex items-center gap-3">
                        <UserCircle size={24} className="text-primary" />
                        <span>My Profile</span>
                      </div>
                      <span className="text-xs text-slate-400 font-normal">{user.name}</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl"
                    >
                      <LogOut size={24} />
                      <span>Logout Account</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { navigate('/login'); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg"
                  >
                    <LogIn size={20} />
                    <span>Login / Register</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
