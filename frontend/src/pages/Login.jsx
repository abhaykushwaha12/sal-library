import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUniversity, FaUserGraduate, FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [role, setRole] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login, register, sendOtp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        if (role !== 'student') throw new Error('Only students can register');
        if (!otpSent) {
          await sendOtp(email);
          setOtpSent(true);
        } else {
          await register(name, email, password, otp);
        }
      } else {
        await login(email, password, role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 to-teal-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-primary text-white mb-4 shadow-lg shadow-primary/30">
            <FaUniversity size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Sal College</h1>
          <p className="text-slate-500 font-medium mt-1">Digital Library Management</p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => { setRole('student'); setError(''); setOtpSent(false); }}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FaUserGraduate /> Student
          </button>
          <button 
            type="button"
            onClick={() => { setRole('admin'); setIsRegistering(false); setError(''); setOtpSent(false); }}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FaUserShield /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && role === 'student' && !otpSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                required
              />
            </motion.div>
          )}

          {(!isRegistering || !otpSent) && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'student' ? "student@sal.edu" : "admin@sal.edu"}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </>
          )}

          {isRegistering && otpSent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-sm font-medium text-slate-600 mb-1">Enter OTP sent to {email}</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                required
              />
            </motion.div>
          )}

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium">
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isRegistering ? (otpSent ? 'Verify OTP & Register' : 'Send OTP') : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        {role === 'student' && (
          <div className="mt-4 text-center">
            <button 
              type="button" 
              onClick={() => { setIsRegistering(!isRegistering); setOtpSent(false); }}
              className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Demo Credentials</p>
          <div className="mt-2 text-sm text-slate-500 bg-slate-50 py-2 rounded-lg inline-block px-4">
            {role === 'student' ? 'student@sal.edu / student123' : 'admin@sal.edu / admin123'}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
